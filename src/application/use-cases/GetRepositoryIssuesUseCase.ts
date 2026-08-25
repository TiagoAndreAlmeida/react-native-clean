import { IssuePage } from '@/domain/entities/Issue';
import { InvalidParameterError } from '@/domain/erros/InvalidParameterError';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';

export interface GetRepositoryIssuesParams {
  id: RepositoryReference;
  page: number;
}

export class GetRepositoryIssuesUseCase {
  constructor(private readonly repository: RepositoryRepository) {}

  async execute(params: GetRepositoryIssuesParams): Promise<IssuePage> {
    if (!params.id.id?.trim()) {
      throw new InvalidParameterError(
        'O parâmetro "id" do repositório é obrigatório.',
      );
    }

    if (!Number.isInteger(params.page) || params.page < 1) {
      throw new InvalidParameterError(
        'O parâmetro "page" deve ser um número inteiro maior que zero.',
      );
    }

    return this.repository.getIssues(params.id, params.page);
  }
}