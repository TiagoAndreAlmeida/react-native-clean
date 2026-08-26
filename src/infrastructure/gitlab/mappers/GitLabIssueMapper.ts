import { Issue, IssuePage } from '@/domain/entities/Issue';
import { GitLabIssueResponse } from '../types/GitLabResponse';

export function mapGitLabIssue(response: GitLabIssueResponse): Issue {
  return {
    id: String(response.id),
    title: response.title,
    labels: response.labels ?? [],
    author: {
      name: response.author?.name ?? '',
      avatarUrl: response.author?.avatar_url ?? null,
    },
    createdAt: new Date(response.created_at),
  };
}

export function mapGitLabIssuePage(
  items: GitLabIssueResponse[],
  page: number,
  hasNextPage: boolean
): IssuePage {
  return {
    items: items.map(mapGitLabIssue),
    page,
    hasNextPage,
  };
}