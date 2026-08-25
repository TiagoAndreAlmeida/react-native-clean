import { Repository } from '@/domain/entities/Repository';
import { InvalidParameterError } from '@/domain/erros/InvalidParameterError';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export class GetDetailsUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: RepositoryReference): Promise<Repository> {
    const hasId = Boolean(params.id);
    const hasOwnerAndName = Boolean(params.owner && params.name);

    if (!hasId && !hasOwnerAndName) {
      throw new InvalidParameterError('Identificador do repositório é obrigatório.');
    }

    return this.repository.getDetails(params);
  }
}