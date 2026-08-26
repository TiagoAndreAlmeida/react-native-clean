export interface GitLabUserResponse {
  id: number;
  username: string;
  name: string;
  avatar_url: string | null;
}

export interface GitLabNamespaceResponse {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  avatar_url: string | null;
}

export interface GitLabProjectResponse {
  id: number;
  name: string;
  path_with_namespace: string;
  description: string | null;
  star_count: number;
  forks_count: number;
  namespace: GitLabNamespaceResponse;
  owner?: GitLabUserResponse | null;
  avatar_url: string | null;
}

export interface GitLabIssueResponse {
  id: number;
  iid: number;
  title: string;
  author: GitLabUserResponse;
  labels: string[];
  created_at: string;
}