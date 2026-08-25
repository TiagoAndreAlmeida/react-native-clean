import { IssuePage } from '@/domain/entities/Issue';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export interface GetRepositoryIssuesParams {
  id: RepositoryReference;
  page: number;
}

export class GetRepositoryIssuesUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: GetRepositoryIssuesParams): Promise<IssuePage> {
    if (!Object.hasOwn(params, 'id') || !Object.hasOwn(params, 'page')) {
      throw new Error('id e page do repositório é obrigatório.');
    }

    return this.repository.getIssues(params.id, params.page);
  }
}