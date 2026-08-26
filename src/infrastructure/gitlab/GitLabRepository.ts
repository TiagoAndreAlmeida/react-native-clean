import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { NetworkError } from '@/domain/errors/NetworkError';
import { RateLimitError } from '@/domain/errors/RateLimitError';

import type { IssuePage } from '@/domain/entities/Issue';
import type { Repository, RepositoryPage } from '@/domain/entities/Repository';
import type { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

import { AxiosClient } from '@/infrastructure/http/AxiosClient';

import {
    mapGitLabRepository,
    mapGitLabRepositoryPage,
} from './mappers/GitLabRepositoryMapper';

import {
    mapGitLabIssuePage,
} from './mappers/GitLabIssueMapper';

import { hasGitLabNextPage } from './helpers/ParseGitLabNextPage';

import { apiConfig } from '../config/apiConfig';
import type {
    GitLabIssueResponse,
    GitLabProjectResponse,
} from './types/GitLabResponse';

const DEFAULT_HEADERS = {
    Accept: 'application/json',
};

function parseGitLabReference(
    reference: RepositoryReference,
): string {
    if (!reference.fullPath || !reference.fullPath.trim()) {
        throw new InvalidParameterError(
            'Referência de repositório inválida.',
        );
    }

    return encodeURIComponent(reference.fullPath.trim());
}

export class GitLabRepository implements RepositoryRepository {
    constructor(private readonly httpClient: AxiosClient) { }

    async search(query: string, page: number): Promise<RepositoryPage> {
        try {
            const response =
                await this.httpClient.get<GitLabProjectResponse[]>(
                    `${apiConfig.gitlab.baseUrl}/projects`,
                    {
                        params: {
                            search: query,
                            page,
                            per_page: 20,
                        },
                        headers: DEFAULT_HEADERS,
                    },
                );

            const hasNextPage = hasGitLabNextPage(
                response.headers?.['x-next-page'],
            );

            return mapGitLabRepositoryPage(
                response.data,
                page,
                hasNextPage,
            );
        } catch (error) {
            throw this.mapError(error);
        }
    }

    async getDetails(
        reference: RepositoryReference,
    ): Promise<Repository> {
        const projectPathOrId = parseGitLabReference(reference);

        try {
            const response =
                await this.httpClient.get<GitLabProjectResponse>(
                    `${apiConfig.gitlab}/projects/${projectPathOrId}`,
                    {
                        headers: DEFAULT_HEADERS,
                    },
                );

            return mapGitLabRepository(response.data);
        } catch (error) {
            throw this.mapError(error);
        }
    }

    async getIssues(
        reference: RepositoryReference,
        page: number,
    ): Promise<IssuePage> {
        const projectId = parseGitLabReference(reference);

        try {
            const response =
                await this.httpClient.get<GitLabIssueResponse[]>(
                    `${apiConfig.gitlab}/projects/${projectId}/issues`,
                    {
                        params: {
                            state: 'opened',
                            page,
                            per_page: 20,
                        },
                        headers: DEFAULT_HEADERS,
                    },
                );

            const hasNextPage = hasGitLabNextPage(
                response.headers?.['x-next-page'],
            );

            return mapGitLabIssuePage(
                response.data,
                page,
                hasNextPage,
            );
        } catch (error) {
            throw this.mapError(error);
        }
    }

    private mapError(error: unknown): Error {
        if (
            error instanceof RateLimitError ||
            error instanceof NetworkError ||
            error instanceof InvalidParameterError
        ) {
            return error;
        }

        if (this.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 429) {
                return new RateLimitError(
                    'Limite de requisições do GitLab excedido.',
                );
            }

            if (status === 403) {
                const remaining =
                    error.response?.headers?.['ratelimit-remaining'] ??
                    error.response?.headers?.['x-ratelimit-remaining'];

                if (remaining === '0') {
                    return new RateLimitError(
                        'Limite de requisições do GitLab excedido.',
                    );
                }
            }

            if (!error.response) {
                return new NetworkError(
                    'Não foi possível conectar ao GitLab.',
                );
            }
        }

        return error instanceof Error
            ? error
            : new Error('Erro inesperado ao acessar o GitLab.');
    }

    private isAxiosError(
        error: unknown,
    ): error is {
        isAxiosError: boolean;
        response?: {
            status?: number;
            headers?: Record<string, string | undefined>;
        };
    } {
        if (
            typeof error !== 'object' ||
            error === null
        ) {
            return false;
        }

        return 'isAxiosError' in error &&
            error.isAxiosError === true;
    }
}