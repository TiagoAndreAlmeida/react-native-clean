import { Repository } from '@/domain/entities/Repository';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export class GetDetailsUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: RepositoryReference): Promise<Repository> {
    if (!params.id || (!params.owner && !params.name)) {
      throw new Error('Identificador do repositório é obrigatório.');
    }

    return this.repository.getDetails(params);
  }
}