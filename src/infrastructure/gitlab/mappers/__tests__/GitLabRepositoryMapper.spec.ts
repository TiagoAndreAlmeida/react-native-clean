import { GitLabProjectResponse } from '../../types/GitLabResponse';
import {
    mapGitLabRepository,
    mapGitLabRepositoryPage,
} from '../GitLabRepositoryMapper';

describe('gitlabRepositoryMapper', () => {
  describe('mapGitLabRepository', () => {
    it('deve mapear um DTO completo do GitLab com owner para a entidade de domínio Repository', () => {
      const response: GitLabProjectResponse = {
        id: 101,
        name: 'alymente-app',
        path_with_namespace: 'alymente/alymente-app',
        description: 'Aplicativo mobile',
        star_count: 50,
        forks_count: 12,
        avatar_url: 'https://gitlab.com/project-avatar.png',
        namespace: {
          id: 1,
          name: 'Alymente Org',
          path: 'alymente',
          kind: 'group',
          full_path: 'alymente',
          avatar_url: 'https://gitlab.com/group-avatar.png',
        },
        owner: {
          id: 200,
          username: 'tiago',
          name: 'Tiago',
          avatar_url: 'https://gitlab.com/user-avatar.png',
        },
      };

      const result = mapGitLabRepository(response);

      expect(result).toEqual({
        id: '101',
        name: 'alymente-app',
        fullName: 'alymente/alymente-app',
        owner: {
          name: 'Tiago',
          avatarUrl: 'https://gitlab.com/project-avatar.png',
        },
        description: 'Aplicativo mobile',
        stars: 50,
        forks: 12,
        watchers: 50,
        language: null,
      });
    });

    it('deve usar namespace como fallback de owner name/avatar quando owner for ausente', () => {
      const response: GitLabProjectResponse = {
        id: 102,
        name: 'backend-api',
        path_with_namespace: 'enterprise/backend-api',
        description: null,
        star_count: 0,
        forks_count: 0,
        avatar_url: null,
        namespace: {
          id: 2,
          name: 'Enterprise Inc',
          path: 'enterprise',
          kind: 'group',
          full_path: 'enterprise',
          avatar_url: 'https://gitlab.com/group-avatar.png',
        },
      };

      const result = mapGitLabRepository(response);

      expect(result.owner).toEqual({
        name: 'Enterprise Inc',
        avatarUrl: 'https://gitlab.com/group-avatar.png',
      });
      expect(result.description).toBeNull();
    });

    it('deve atribuir valores padrão seguros quando campos numéricos ou textos forem nulos/indefinidos', () => {
      const response = {
        id: 103,
        name: 'repo-sem-dados',
        path_with_namespace: 'user/repo-sem-dados',
      } as GitLabProjectResponse;

      const result = mapGitLabRepository(response);

      expect(result).toEqual({
        id: '103',
        name: 'repo-sem-dados',
        fullName: 'user/repo-sem-dados',
        owner: {
          name: '',
          avatarUrl: null,
        },
        description: null,
        stars: 0,
        forks: 0,
        watchers: 0,
        language: null,
      });
    });
  });

  describe('mapGitLabRepositoryPage', () => {
    it('deve converter uma lista de projetos do GitLab para RepositoryPage', () => {
      const items: GitLabProjectResponse[] = [
        {
          id: 1,
          name: 'repo-1',
          path_with_namespace: 'org/repo-1',
          description: 'Repo 1',
          star_count: 10,
          forks_count: 2,
          avatar_url: null,
          namespace: {
            id: 1,
            name: 'Org',
            path: 'org',
            kind: 'group',
            full_path: 'org',
            avatar_url: null,
          },
        },
      ];

      const pageResult = mapGitLabRepositoryPage(items, 1, true);

      expect(pageResult).toEqual({
        items: [mapGitLabRepository(items[0])],
        page: 1,
        hasNextPage: true,
      });
    });

    it('deve lidar corretamente com lista de itens vazia', () => {
      const pageResult = mapGitLabRepositoryPage([], 1, false);

      expect(pageResult).toEqual({
        items: [],
        page: 1,
        hasNextPage: false,
      });
    });
  });
});