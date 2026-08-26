import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { NetworkError } from '@/domain/errors/NetworkError';
import { RateLimitError } from '@/domain/errors/RateLimitError';

import type { IssuePage } from '@/domain/entities/Issue';
import type { Repository, RepositoryPage } from '@/domain/entities/Repository';
import type { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

import { AxiosClient } from '@/infrastructure/http/AxiosClient';

import {
    mapGitHubRepository,
    mapGitHubRepositoryPage,
} from './mappers/GitHubRepositoryMapper';

import {
    mapGitHubIssues,
} from './mappers/GitHubIssueMapper';

import { parseGitHubLinkHeader } from './helpers/ParseGitHubLinkHeader';

import { apiConfig } from '../config/apiConfig';
import type {
    GitHubIssueResponse,
    GitHubRepositoryResponse,
    GitHubSearchRepositoriesResponse
} from './types/GitHubResponse';

const DEFAULT_HEADERS = {
    Accept: 'application/vnd.github+json',
};

function parseGitHubReference(
    reference: RepositoryReference,
): {
    owner: string;
    name: string;
} {
    const parts = reference.fullPath.split('/');

    if (parts.length !== 2) {
        throw new InvalidParameterError(
            'Referência de repositório inválida.',
        );
    }

    const [owner, name] = parts;

    if (!owner.trim() || !name.trim()) {
        throw new InvalidParameterError(
            'Referência de repositório inválida.',
        );
    }

    return {
        owner,
        name,
    };
}

export class GitHubRepository implements RepositoryRepository {
    constructor(
        private readonly httpClient: AxiosClient,
    ) { }

    async search(
        query: string,
        page: number,
    ): Promise<RepositoryPage> {
        try {
            const response =
                await this.httpClient.get<GitHubSearchRepositoriesResponse>(
                    `${apiConfig.github}/search/repositories`,
                    {
                        params: {
                            q: query,
                            sort: 'stars',
                            order: 'desc',
                            page,
                            per_page: 20,
                        },
                        headers: DEFAULT_HEADERS,
                    },
                );

            const { hasNextPage } =
                parseGitHubLinkHeader(
                    response.headers.link,
                );

            return mapGitHubRepositoryPage(
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
        const { owner, name } =
            parseGitHubReference(reference);

        try {
            const response =
                await this.httpClient.get<GitHubRepositoryResponse>(
                    `${apiConfig.github}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
                    {
                        headers: DEFAULT_HEADERS,
                    },
                );

            return mapGitHubRepository(response.data);
        } catch (error) {
            throw this.mapError(error);
        }
    }

    async getIssues(
        reference: RepositoryReference,
        page: number,
    ): Promise<IssuePage> {
        const { owner, name } =
            parseGitHubReference(reference);

        try {
            const response =
                await this.httpClient.get<GitHubIssueResponse[]>(
                    `${apiConfig.github}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/issues`,
                    {
                        params: {
                            state: 'open',
                            page,
                            per_page: 20,
                        },
                        headers: DEFAULT_HEADERS,
                    },
                );

            const { hasNextPage } =
                parseGitHubLinkHeader(
                    response.headers.link,
                );

            return {
                items: mapGitHubIssues(response.data),
                page,
                hasNextPage,
            };
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
                    'Limite de requisições do GitHub excedido.',
                );
            }

            if (status === 403) {
                const remaining =
                    error.response?.headers?.['x-ratelimit-remaining'];

                if (remaining === '0') {
                    return new RateLimitError(
                        'Limite de requisições do GitHub excedido.',
                    );
                }
            }

            if (!error.response) {
                return new NetworkError(
                    'Não foi possível conectar ao GitHub.',
                );
            }
        }

        return error instanceof Error
            ? error
            : new Error('Erro inesperado ao acessar o GitHub.');
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