import { Repository } from '@/domain/entities/Repository';
import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';
import { GetDetailsUseCase } from '../GetDetailsUseCase';

describe('GetDetailsUseCase', () => {
  let repositoryMock: jest.Mocked<RepositoryRepository>;
  let useCase: GetDetailsUseCase;

  beforeEach(() => {
    repositoryMock = {
      search: jest.fn(),
      getDetails: jest.fn(),
      getIssues: jest.fn(),
    };
    useCase = new GetDetailsUseCase(repositoryMock);
  });

  it('deve lançar um erro se o fullPath do repositório não for informado', async () => {
    const invalidParams = { fullPath: '' } as RepositoryReference;

    await expect(useCase.execute(invalidParams)).rejects.toBeInstanceOf(InvalidParameterError);
    expect(repositoryMock.getDetails).not.toHaveBeenCalled();
  });

  it('deve chamar repository.getDetails com os parâmetros válidos e retornar os detalhes do repositório', async () => {
    const validParams: RepositoryReference = {
      fullPath: 'owner/name',
    };

    const mockRepository: Repository = {
      id: '123',
      name: 'react-native',
      fullName: 'facebook/react-native',
      owner: {
        name: 'facebook',
        avatarUrl: 'https://avatar.url',
      },
      stars: 100000,
      forks: 20000,
      watchers: 3000,
      language: 'TypeScript',
      description: 'A framework for building native apps using React',
    };

    repositoryMock.getDetails.mockResolvedValueOnce(mockRepository);

    const result = await useCase.execute(validParams);

    expect(repositoryMock.getDetails).toHaveBeenCalledWith(validParams);
    expect(repositoryMock.getDetails).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRepository);
  });
});