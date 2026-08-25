import { RepositoryPage } from '@/domain/entities/Repository';
import { RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export interface SearchRepositoriesParams {
  query: string;
  page: number;
}

export class SearchRepositoriesUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: SearchRepositoriesParams): Promise<RepositoryPage> {
    if (!Object.hasOwn(params, 'page')) {
      throw new Error('O parâmetro "page" é obrigatório.');
    }
    
    const query = params.query ? params.query.trim() : '';

    return this.repository.search(query, params.page);
  }
}