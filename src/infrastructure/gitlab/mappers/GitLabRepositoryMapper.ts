import { Repository, RepositoryPage } from '@/domain/entities/Repository';
import { GitLabProjectResponse } from '../types/GitLabResponse';

export function mapGitLabRepository(response: GitLabProjectResponse): Repository {
  const ownerName = response.owner?.name ?? response.namespace?.name ?? '';
  const avatarUrl =
    response.avatar_url ??
    response.owner?.avatar_url ??
    response.namespace?.avatar_url ??
    null;

  return {
    id: String(response.id),
    name: response.name,
    fullName: response.path_with_namespace,
    owner: {
      name: ownerName,
      avatarUrl,
    },
    description: response.description ?? null,
    stars: response.star_count ?? 0,
    forks: response.forks_count ?? 0,
    watchers: response.star_count ?? 0,
    language: null,
  };
}

export function mapGitLabRepositoryPage(
  items: GitLabProjectResponse[],
  page: number,
  hasNextPage: boolean
): RepositoryPage {
  return {
    items: items.map(mapGitLabRepository),
    page,
    hasNextPage,
  };
}