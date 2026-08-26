import { GitLabIssueResponse } from '../../types/GitLabResponse';
import {
    mapGitLabIssue,
    mapGitLabIssuePage,
} from '../GitLabIssueMapper';

describe('gitlabIssueMapper', () => {
  describe('mapGitLabIssue', () => {
    it('deve mapear um DTO completo de issue do GitLab para a entidade de domínio Issue', () => {
      const response: GitLabIssueResponse = {
        id: 501,
        iid: 12,
        title: 'Erro ao autenticar usuário',
        labels: ['bug', 'critical'],
        created_at: '2026-03-10T14:30:00.000Z',
        author: {
          id: 42,
          username: 'octocat',
          name: 'Octocat Dev',
          avatar_url: 'https://gitlab.com/avatars/octocat.png',
        },
      };

      const result = mapGitLabIssue(response);

      expect(result).toEqual({
        id: '501',
        title: 'Erro ao autenticar usuário',
        labels: ['bug', 'critical'],
        author: {
          name: 'Octocat Dev',
          avatarUrl: 'https://gitlab.com/avatars/octocat.png',
        },
        createdAt: new Date('2026-03-10T14:30:00.000Z'),
      });
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('deve atribuir valores padrão para autor e labels quando forem ausentes ou nulos', () => {
      const response = {
        id: 502,
        iid: 13,
        title: 'Issue sem autor e sem labels',
        created_at: '2026-04-01T10:00:00.000Z',
      } as GitLabIssueResponse;

      const result = mapGitLabIssue(response);

      expect(result).toEqual({
        id: '502',
        title: 'Issue sem autor e sem labels',
        labels: [],
        author: {
          name: '',
          avatarUrl: null,
        },
        createdAt: new Date('2026-04-01T10:00:00.000Z'),
      });
    });
  });

  describe('mapGitLabIssuePage', () => {
    it('deve converter uma lista de issues do GitLab para a estrutura IssuePage', () => {
      const items: GitLabIssueResponse[] = [
        {
          id: 1,
          iid: 101,
          title: 'Primeira issue',
          labels: ['feature'],
          created_at: '2026-01-01T00:00:00.000Z',
          author: {
            id: 10,
            username: 'alice',
            name: 'Alice',
            avatar_url: null,
          },
        },
      ];

      const pageResult = mapGitLabIssuePage(items, 1, true);

      expect(pageResult).toEqual({
        items: [mapGitLabIssue(items[0])],
        page: 1,
        hasNextPage: true,
      });
    });

    it('deve retornar a página corretamente quando a lista de itens estiver vazia', () => {
      const pageResult = mapGitLabIssuePage([], 2, false);

      expect(pageResult).toEqual({
        items: [],
        page: 2,
        hasNextPage: false,
      });
    });
  });
});