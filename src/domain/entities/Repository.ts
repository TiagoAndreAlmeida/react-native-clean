export interface RepositoryOwner {
  name: string;
  avatarUrl: string | null;
}

export interface RepositoryPage {
    items: Repository[];
    page: number;
    hasNextPage: boolean;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: RepositoryOwner;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
}