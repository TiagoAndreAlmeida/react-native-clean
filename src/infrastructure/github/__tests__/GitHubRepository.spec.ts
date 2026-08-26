import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { NetworkError } from '@/domain/errors/NetworkError';
import { RateLimitError } from '@/domain/errors/RateLimitError';
import { AxiosClient } from '@/infrastructure/http/AxiosClient';
import { apiConfig } from '../../config/apiConfig';
import { GitHubRepository } from '../GitHubRepository';

describe('GitHubRepository', () => {
  let httpClientMock: jest.Mocked<AxiosClient>;
  let repository: GitHubRepository;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AxiosClient>;

    repository = new GitHubRepository(httpClientMock);
  });

  describe('search', () => {
    it('deve buscar repositórios no GitHub com os parâmetros e cabeçalhos corretos', async () => {
      const mockSearchResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 123,
            name: 'react',
            full_name: 'facebook/react',
            owner: {
              login: 'facebook',
              avatar_url: 'https://github.com/facebook.png',
            },
            description: 'A JavaScript library for building user interfaces',
            stargazers_count: 200000,
            forks_count: 40000,
            watchers_count: 200000,
            language: 'JavaScript',
          },
        ],
      };

      const linkHeader = '<https://api.github.com/search/repositories?q=react&page=2>; rel="next"';

      httpClientMock.get.mockResolvedValueOnce({
        data: mockSearchResponse,
        headers: { link: linkHeader },
      } as any);

      const result = await repository.search('react', 1);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.github}/search/repositories`,
        {
          params: {
            q: 'react',
            sort: 'stars',
            order: 'desc',
            page: 1,
            per_page: 20,
          },
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }
      );

      expect(result).toEqual({
        items: [
          {
            id: '123',
            name: 'react',
            fullName: 'facebook/react',
            owner: {
              name: 'facebook',
              avatarUrl: 'https://github.com/facebook.png',
            },
            description: 'A JavaScript library for building user interfaces',
            stars: 200000,
            forks: 40000,
            watchers: 200000,
            language: 'JavaScript',
          },
        ],
        page: 1,
        hasNextPage: true,
      });
    });
  });

  describe('getDetails', () => {
    it('deve lançar InvalidParameterError se fullPath for inválido ou não possuir owner e name', async () => {
      await expect(
        repository.getDetails({ fullPath: 'facebook' } as any)
      ).rejects.toThrow(InvalidParameterError);

      await expect(
        repository.getDetails({ fullPath: ' /react' } as any)
      ).rejects.toThrow('Referência de repositório inválida.');

      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('deve buscar detalhes do repositório codificando o owner e o name na URL', async () => {
      const mockRepositoryResponse = {
        id: 123,
        name: 'react',
        full_name: 'facebook/react',
        owner: {
          login: 'facebook',
          avatar_url: 'https://github.com/facebook.png',
        },
        description: 'React core',
        stargazers_count: 200000,
        forks_count: 40000,
        watchers_count: 200000,
        language: 'JavaScript',
      };

      httpClientMock.get.mockResolvedValueOnce({
        data: mockRepositoryResponse,
        headers: {},
      } as any);

      const result = await repository.getDetails({ fullPath: 'facebook/react' } as any);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.github}/repos/facebook/react`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }
      );

      expect(result.id).toBe('123');
      expect(result.fullName).toBe('facebook/react');
    });
  });

  describe('getIssues', () => {
    it('deve lançar InvalidParameterError se a referência do repositório for inválida', async () => {
      await expect(
        repository.getIssues({ fullPath: 'invalido' } as any, 1)
      ).rejects.toThrow(InvalidParameterError);

      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('deve buscar as issues abertas do repositório no GitHub', async () => {
      const mockIssuesResponse = [
        {
          id: 999,
          title: 'Bug na renderização',
          labels: [{ id: 1, name: 'bug' }],
          created_at: '2026-01-10T10:00:00Z',
          user: {
            login: 'octocat',
            avatar_url: 'https://github.com/octocat.png',
          },
        },
      ];

      httpClientMock.get.mockResolvedValueOnce({
        data: mockIssuesResponse,
        headers: { link: '' },
      } as any);

      const result = await repository.getIssues(
        { fullPath: 'facebook/react' } as any,
        1
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${apiConfig.github}/repos/facebook/react/issues`,
        {
          params: {
            state: 'open',
            page: 1,
            per_page: 20,
          },
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }
      );

      expect(result.hasNextPage).toBe(false);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Bug na renderização');
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
        'Limite de requisições do GitHub excedido.'
      );
    });

    it('deve converter status HTTP 403 com x-ratelimit-remaining zerado para RateLimitError', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          headers: { 'x-ratelimit-remaining': '0' },
        },
      };

      httpClientMock.get.mockRejectedValue(axiosError);

      await expect(repository.search('test', 1)).rejects.toThrow(RateLimitError);
      await expect(repository.search('test', 1)).rejects.toThrow(
        'Limite de requisições do GitHub excedido.'
      );
    });

    it('deve converter erro sem response para NetworkError', async () => {
      const axiosError = {
        isAxiosError: true,
        response: undefined,
      };

      httpClientMock.get.mockRejectedValue(axiosError);

      await expect(repository.search('test', 1)).rejects.toThrow(NetworkError);
      await expect(repository.search('test', 1)).rejects.toThrow(
        'Não foi possível conectar ao GitHub.'
      );
    });

    it('deve repassar instâncias de erros de domínio já mapeados sem alteração', async () => {
      const customError = new InvalidParameterError('Erro de parâmetro');

      httpClientMock.get.mockRejectedValue(customError);

      await expect(repository.search('test', 1)).rejects.toThrow(customError);
    });
  });
});