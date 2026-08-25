import { IssuePage } from '../entities/Issue';
import type { Repository, RepositoryPage } from '../entities/Repository';


export type RepositoryReference =
  | { id: string; owner?: string; name?: string }
  | { id?: string; owner: string; name: string };
  
export interface RepositoryRepository {
  search(query: string, page: number): Promise<RepositoryPage>;
  getDetails(reference: RepositoryReference): Promise<Repository>;
  getIssues(reference: RepositoryReference, page: number): Promise<IssuePage>;
}