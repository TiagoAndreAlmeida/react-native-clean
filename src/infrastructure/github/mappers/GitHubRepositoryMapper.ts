import type { Repository, RepositoryPage } from '@/domain/entities/Repository';

import type {
    GitHubRepositoryResponse,
    GitHubSearchRepositoriesResponse,
} from '../types/GitHubResponse';

export function mapGitHubRepository(source: GitHubRepositoryResponse): Repository {
  return {
    id: String(source.id),
    name: source.name,
    fullName: source.full_name,
    owner: {
      name: source.owner.login,
      avatarUrl: source.owner.avatar_url,
    },
    description: source.description,
    stars: source.stargazers_count,
    forks: source.forks_count,
    watchers: source.watchers_count,
    language: source.language,
  };
}

export function mapGitHubRepositoryPage(
  source: GitHubSearchRepositoriesResponse,
  page: number,
  hasNextPage: boolean,
): RepositoryPage {
  return {
    items: source.items.map(mapGitHubRepository),
    page,
    hasNextPage,
  };
}