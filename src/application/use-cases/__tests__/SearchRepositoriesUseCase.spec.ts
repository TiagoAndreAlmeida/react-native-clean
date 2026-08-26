import { RepositoryPage } from '@/domain/entities/Repository';
import { InvalidParameterError } from '@/domain/errors/InvalidParameterError';
import { RepositoryRepository } from '@/domain/repositories/RepositoryRepository';
import { SearchRepositoriesUseCase } from '../SearchRepositoriesUseCase';

describe('SearchRepositoriesUseCase', () => {
  let repositoryMock: jest.Mocked<RepositoryRepository>;
  let useCase: SearchRepositoriesUseCase;

  beforeEach(() => {
    repositoryMock = {
      search: jest.fn(),
      getDetails: jest.fn(),
      getIssues: jest.fn(),
    };
    useCase = new SearchRepositoriesUseCase(repositoryMock);
  });

  it('deve lançar um erro se o parâmetro page não for informado', async () => {
    await expect(
      useCase.execute({ query: 'react native' } as any)
    ).rejects.toBeInstanceOf(InvalidParameterError);

    expect(repositoryMock.search).not.toHaveBeenCalled();
  });

  it('deve lançar um erro se o parâmetro page não for um número inteiro maior que zero', async () => {
    await expect(
      useCase.execute({ query: 'react native', page: 0 })
    ).rejects.toBeInstanceOf(InvalidParameterError);
    expect(repositoryMock.search).not.toHaveBeenCalled();
  });

  it('deve lançar um erro se o parâmetro page não for um número inteiro', async () => {
    await expect(
      useCase.execute({ query: 'react native', page: null as any })
    ).rejects.toBeInstanceOf(InvalidParameterError);
    expect(repositoryMock.search).not.toHaveBeenCalled();
  });

  it('deve chamar repository.search com os parâmetros corretos e retornar o resultado', async () => {
    const mockPage: RepositoryPage = {
      items: [
        {
          id: '1',
          name: 'react-native',
          fullName: 'facebook/react-native',
          owner: {
            name: 'facebook',
            avatarUrl: null
          },
          stars: 100000,
          forks: 20000,
          watchers: 3000,
          language: 'TypeScript',
          description: 'A framework for building native apps',
        },
      ],
      page: 1,
      hasNextPage: false,
    };

    repositoryMock.search.mockResolvedValueOnce(mockPage);

    const result = await useCase.execute({ query: 'react native', page: 1 });

    expect(repositoryMock.search).toHaveBeenCalledWith('react native', 1);
    expect(result).toEqual(mockPage);
  });
});