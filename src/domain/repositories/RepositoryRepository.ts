import { IssuePage } from '../entities/Issue';
import type { Repository, RepositoryPage } from '../entities/Repository';


export interface RepositoryReference { //essa interface é usada para conseguir usar o id tanto do github quanto do gitlab depedento da implementação.
  id: string;
  owner: string;
  name: string;
}

export interface RepositoryRepository {
  search(query: string, page: number): Promise<RepositoryPage>;
  getDetails(reference: RepositoryReference): Promise<Repository>;
  getIssues(reference: RepositoryReference, page: number): Promise<IssuePage>;
}