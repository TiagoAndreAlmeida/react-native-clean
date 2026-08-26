export interface GitHubUserResponse {
  login: string;
  avatar_url: string | null;
}

export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubUserResponse;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
}

export interface GitHubSearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepositoryResponse[];
}

export interface GitHubIssueLabelResponse {
  id: number;
  name: string;
}

export interface GitHubIssueResponse {
  id: number;
  title: string;
  user: GitHubUserResponse | null;
  labels: GitHubIssueLabelResponse[];
  created_at: string;
  pull_request?: {
    url: string;
    html_url: string;
  };
}