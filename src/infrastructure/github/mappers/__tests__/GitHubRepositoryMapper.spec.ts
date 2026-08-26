import type {
    GitHubRepositoryResponse,
    GitHubSearchRepositoriesResponse,
} from '@/infrastructure/github/types/GitHubResponse';

import {
    mapGitHubRepository,
    mapGitHubRepositoryPage,
} from '@/infrastructure/github/mappers/GitHubRepositoryMapper';

describe('GitHubRepositoryMapper', () => {
  describe('mapGitHubRepository', () => {
    it('deve mapear corretamente um repositório do GitHub para a entidade Repository', () => {
      const source: GitHubRepositoryResponse = {
        id: 123456,
        name: 'react-native',
        full_name: 'facebook/react-native',
        owner: {
          login: 'facebook',
          avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        },
        description: 'A framework for building native applications using React.',
        stargazers_count: 110000,
        forks_count: 23000,
        watchers_count: 3000,
        language: 'JavaScript',
      };

      const result = mapGitHubRepository(source);

      expect(result).toEqual({
        id: '123456',
        name: 'react-native',
        fullName: 'facebook/react-native',
        owner: {
          name: 'facebook',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/69631?v=4',
        },
        description:
          'A framework for building native applications using React.',
        stars: 110000,
        forks: 23000,
        watchers: 3000,
        language: 'JavaScript',
      });
    });

    it('deve preservar valores nulos permitidos pelo domínio', () => {
      const source: GitHubRepositoryResponse = {
        id: 123456,
        name: 'project',
        full_name: 'owner/project',
        owner: {
          login: 'owner',
          avatar_url: null,
        },
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        watchers_count: 0,
        language: null,
      };

      const result = mapGitHubRepository(source);

      expect(result).toEqual({
        id: '123456',
        name: 'project',
        fullName: 'owner/project',
        owner: {
          name: 'owner',
          avatarUrl: null,
        },
        description: null,
        stars: 0,
        forks: 0,
        watchers: 0,
        language: null,
      });
    });

    it('deve converter o id numérico do GitHub para string', () => {
      const source: GitHubRepositoryResponse = {
        id: 42,
        name: 'test',
        full_name: 'owner/test',
        owner: {
          login: 'owner',
          avatar_url: null,
        },
        description: null,
        stargazers_count: 10,
        forks_count: 5,
        watchers_count: 3,
        language: 'TypeScript',
      };

      const result = mapGitHubRepository(source);

      expect(result.id).toBe('42');
      expect(typeof result.id).toBe('string');
    });
  });

  describe('mapGitHubRepositoryPage', () => {
    it('deve mapear todos os repositórios da página', () => {
      const source: GitHubSearchRepositoriesResponse = {
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            id: 1,
            name: 'react-native',
            full_name: 'facebook/react-native',
            owner: {
              login: 'facebook',
              avatar_url: 'https://example.com/facebook.png',
            },
            description: 'React Native',
            stargazers_count: 100,
            forks_count: 20,
            watchers_count: 10,
            language: 'JavaScript',
          },
          {
            id: 2,
            name: 'typescript',
            full_name: 'microsoft/TypeScript',
            owner: {
              login: 'microsoft',
              avatar_url: 'https://example.com/microsoft.png',
            },
            description: 'TypeScript language',
            stargazers_count: 200,
            forks_count: 40,
            watchers_count: 20,
            language: 'TypeScript',
          },
        ],
      };

      const result = mapGitHubRepositoryPage(source, 2, true);

      expect(result.page).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.items).toHaveLength(2);

      expect(result.items[0]).toEqual({
        id: '1',
        name: 'react-native',
        fullName: 'facebook/react-native',
        owner: {
          name: 'facebook',
          avatarUrl: 'https://example.com/facebook.png',
        },
        description: 'React Native',
        stars: 100,
        forks: 20,
        watchers: 10,
        language: 'JavaScript',
      });

      expect(result.items[1]).toEqual({
        id: '2',
        name: 'typescript',
        fullName: 'microsoft/TypeScript',
        owner: {
          name: 'microsoft',
          avatarUrl: 'https://example.com/microsoft.png',
        },
        description: 'TypeScript language',
        stars: 200,
        forks: 40,
        watchers: 20,
        language: 'TypeScript',
      });
    });

    it('deve retornar uma lista vazia quando a resposta não possuir repositórios', () => {
      const source: GitHubSearchRepositoriesResponse = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      };

      const result = mapGitHubRepositoryPage(source, 1, false);

      expect(result).toEqual({
        items: [],
        page: 1,
        hasNextPage: false,
      });
    });

    it('deve preservar o estado de paginação recebido', () => {
      const source: GitHubSearchRepositoriesResponse = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      };

      expect(mapGitHubRepositoryPage(source, 3, true).hasNextPage).toBe(true);
      expect(mapGitHubRepositoryPage(source, 3, false).hasNextPage).toBe(false);
    });
  });
});