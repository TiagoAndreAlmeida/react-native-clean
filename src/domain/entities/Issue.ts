export interface IssueAuthor {
  name: string;
  avatarUrl: string | null;
}

export interface IssuePage {
    items: Issue[];
    page: number;
    hasNextPage: boolean;
}

export interface Issue {
  id: string;
  title: string;
  labels: string[];
  author: IssueAuthor;
  createdAt: Date;
}