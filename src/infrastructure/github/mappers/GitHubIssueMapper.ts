import type { Issue } from '@/domain/entities/Issue';
import type { GitHubIssueResponse } from '../types/GitHubResponse';

export function mapGitHubIssue(
  source: GitHubIssueResponse,
): Issue | null {
  if (source.pull_request) {
    return null;
  }

  return {
    id: String(source.id),
    title: source.title,
    labels: source.labels.map((label) => label.name),
    author: {
      name: source.user?.login ?? 'Usuário desconhecido',
      avatarUrl: source.user?.avatar_url ?? null,
    },
    createdAt: new Date(source.created_at),
  };
}

export function mapGitHubIssues(
  source: GitHubIssueResponse[],
): Issue[] {
  return source.flatMap((issue) => {
    const mapped = mapGitHubIssue(issue);

    return mapped ? [mapped] : [];
  });
}