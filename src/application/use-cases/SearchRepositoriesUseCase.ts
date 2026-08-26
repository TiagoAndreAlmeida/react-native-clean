import { RepositoryPage } from '@/domain/entities/Repository';
import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export interface SearchRepositoriesParams {
  query: string;
  page: number;
}

export class SearchRepositoriesUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: SearchRepositoriesParams): Promise<RepositoryPage> {
    if (!Number.isInteger(params.page) || params.page < 1) {
        throw new InvalidParameterError('O parâmetro "page" deve ser um número inteiro maior que zero.');
    }
    
    const query = params.query ? params.query.trim() : '';

    return this.repository.search(query, params.page);
  }
}