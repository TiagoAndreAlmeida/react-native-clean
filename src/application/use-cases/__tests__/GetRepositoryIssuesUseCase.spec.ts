import { IssuePage } from '@/domain/entities/Issue';
import { InvalidParameterError } from '@/domain/erros/InvalidParameterError';
import { RepositoryReference, RepositoryRepository } from '@/domain/repositories/RepositoryRepository';
import { GetRepositoryIssuesUseCase } from '../GetRepositoryIssuesUseCase';

describe('GetRepositoryIssuesUseCase', () => {
  let repositoryMock: jest.Mocked<RepositoryRepository>;
  let useCase: GetRepositoryIssuesUseCase;

  beforeEach(() => {
    repositoryMock = {
      search: jest.fn(),
      getDetails: jest.fn(),
      getIssues: jest.fn(),
    };
    useCase = new GetRepositoryIssuesUseCase(repositoryMock);
  });

  it('deve lançar um erro se a propriedade "id" não for informada', async () => {
    await expect(
      useCase.execute({ page: 1, id: { id: null } } as any)
    ).rejects.toBeInstanceOf(InvalidParameterError);

    expect(repositoryMock.getIssues).not.toHaveBeenCalled();
  });

  it('deve lançar um erro se a propriedade "page" não for informada', async () => {
    await expect(
      useCase.execute({ id: { id: '123' } } as any)
    ).rejects.toBeInstanceOf(InvalidParameterError);

    expect(repositoryMock.getIssues).not.toHaveBeenCalled();
  });

  it('deve chamar repository.getIssues com os parâmetros corretos e retornar a lista de issues', async () => {
    const mockRef: RepositoryReference = { id: '123', owner: '', name: '' };
    const mockIssuePage: IssuePage = {
      items: [
        {
          id: '1',
          title: 'Bug na renderização de lista',
          author: {
            name: 'user1',
            avatarUrl: 'https://example.com/avatar1.png',
          },
          labels: ['bug', 'frontend'],
          createdAt: new Date('2026-01-15T10:00:00Z'),
        },
      ],
      page: 1,
      hasNextPage: false,
    };

    repositoryMock.getIssues.mockResolvedValueOnce(mockIssuePage);

    const result = await useCase.execute({ id: mockRef, page: 1 });

    expect(repositoryMock.getIssues).toHaveBeenCalledWith(mockRef, 1);
    expect(repositoryMock.getIssues).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockIssuePage);
  });
});