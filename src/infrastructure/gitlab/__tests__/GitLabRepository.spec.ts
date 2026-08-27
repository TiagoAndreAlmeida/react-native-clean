import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { NetworkError } from '@/domain/errors/NetworkError';
import { RateLimitError } from '@/domain/errors/RateLimitError';
import { AxiosClient } from '@/infrastructure/http/AxiosClient';
import { apiConfig } from '../../config/apiConfig';
import { GitLabRepository } from '../GitLabRepository';

describe('GitLabRepository', () => {
  let httpClientMock: jest.Mocked<AxiosClient>;
  let repository: GitLabRepository;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AxiosClient>;

    repository = new GitLabRepository(httpClientMock);
  });

  describe('search', () => {
    it('deve buscar repositórios no GitLab com os parâmetros e cabeçalhos corretos', async () => {
      const mockProjectResponse = [
        {
          id: 10,
          name: 'project-a',
          path_with_namespace: 'group/project-a',
          description: 'Projeto A',
          star_count: 15,
          forks_count: 3,
          avatar_url: null,
          namespace: {
            id: 1,
            name: 'Group',
            path: 'group',
            kind: 'group',
            full_path: 'group',
            avatar_url: null,
          },
        },
      ];

      httpClientMock.get.mockResolvedValueOnce({
        data: mockProjectResponse,
        headers: { 'x-next-page': '2' },
        status: 200,
        statusText: 'OK',
        config: {} as any,
      });

      const result = await repository.search('project-a', 1);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.gitlab.baseUrl}/projects`,
        {
          params: {
            search: 'project-a',
            page: 1,
            per_page: 20,
          },
          headers: {
            Accept: 'application/json',
          },
        }
      );

      expect(result).toEqual({
        items: [
          {
            id: '10',
            name: 'project-a',
            fullName: 'group/project-a',
            owner: {
              name: 'Group',
              avatarUrl: null,
            },
            description: 'Projeto A',
            stars: 15,
            forks: 3,
            watchers: 15,
            language: null,
          },
        ],
        page: 1,
        hasNextPage: true,
      });
    });
  });

  describe('getDetails', () => {
    it('deve lançar InvalidParameterError se fullPath for inválido ou vazio', async () => {
      await expect(
        repository.getDetails({ fullPath: '' } as any)
      ).rejects.toThrow(InvalidParameterError);

      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('deve buscar detalhes do repositório codificando o fullPath corretamente na URL', async () => {
      const mockProject = {
        id: 10,
        name: 'project-a',
        path_with_namespace: 'group/project-a',
        description: 'Projeto A',
        star_count: 10,
        forks_count: 2,
        avatar_url: null,
        namespace: {
          id: 1,
          name: 'Group',
          path: 'group',
          kind: 'group',
          full_path: 'group',
          avatar_url: null,
        },
      };

      httpClientMock.get.mockResolvedValueOnce({
        data: mockProject,
        headers: {},
        status: 200,
        statusText: 'OK',
        config: {} as any,
      });

      const result = await repository.getDetails({ fullPath: 'group/project-a' } as any);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.gitlab.baseUrl}/projects/group%2Fproject-a`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      expect(result.id).toBe('10');
      expect(result.fullName).toBe('group/project-a');
    });
  });

  describe('getIssues', () => {
    it('deve lançar InvalidParameterError se fullPath for inválido', async () => {
      await expect(
        repository.getIssues({ fullPath: '  ' } as any, 1)
      ).rejects.toThrow(InvalidParameterError);

      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('deve buscar as issues abertas do repositório no GitLab', async () => {
      const mockIssuesResponse = [
        {
          id: 101,
          iid: 1,
          title: 'Bug no login',
          labels: ['bug'],
          created_at: '2026-02-01T10:00:00.000Z',
          author: {
            id: 5,
            username: 'user1',
            name: 'User One',
            avatar_url: null,
          },
        },
      ];

      httpClientMock.get.mockResolvedValueOnce({
        data: mockIssuesResponse,
        headers: { 'x-next-page': '' },
        status: 200,
        statusText: 'OK',
        config: {} as any,
      });

      const result = await repository.getIssues(
        { fullPath: 'group/project-a' } as any,
        1
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.gitlab.baseUrl}/projects/group%2Fproject-a/issues`,
        {
          params: {
            state: 'opened',
            page: 1,
            per_page: 20,
          },
          headers: {
            Accept: 'application/json',
          },
        }
      );

      expect(result.hasNextPage).toBe(false);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Bug no login');
    });
  });

  describe('Tratamento de Erros (mapError)', () => {
    it('deve converter status HTTP 429 para RateLimitError', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 429 },
      };

      httpClientMock.get.mockRejectedValue(axiosError);

      await expect(repository.search('test', 1)).rejects.toThrow(RateLimitError);
      await expect(repository.search('test', 1)).rejects.toThrow(
        'Limite de requisições do GitLab excedido.'
      );
    });

    it('deve converter status HTTP 403 com limite zerado para RateLimitError', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          headers: { 'ratelimit-remaining': '0' },
        },
      };

      httpClientMock.get.mockRejectedValueOnce(axiosError);

      await expect(repository.search('test', 1)).rejects.toThrow(RateLimitError);
    });

    it('deve converter erro sem response para NetworkError', async () => {
      const axiosError = {
        isAxiosError: true,
        response: undefined,
      };

      httpClientMock.get.mockRejectedValue(axiosError);

      await expect(repository.search('test', 1)).rejects.toThrow(NetworkError);
      await expect(repository.search('test', 1)).rejects.toThrow(
        'Não foi possível conectar ao GitLab.'
      );
    });

    it('deve repassar instâncias de erros de domínio já mapeados sem alteração', async () => {
      const customError = new InvalidParameterError('Erro customizado');

      httpClientMock.get.mockRejectedValueOnce(customError);

      await expect(repository.search('test', 1)).rejects.toThrow(customError);
    });
  });
});