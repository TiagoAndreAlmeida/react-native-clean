import { Repository } from '@/domain/entities/Repository';
import { InvalidParameterError } from '@/domain/erros/InvalidParameterError';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export class GetDetailsUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: RepositoryReference): Promise<Repository> {

    if (!params.fullPath.trim()) {
      throw new InvalidParameterError('O parâmetro fullPath do repositório é obrigatório.');
    }

    return this.repository.getDetails(params);
  }
}