type DataSource = 'github' | 'gitlab';

import { GetDetailsUseCase } from '@/application/use-cases/GetDetailsUseCase';
import { GetRepositoryIssuesUseCase } from '@/application/use-cases/GetRepositoryIssuesUseCase';
import { SearchRepositoriesUseCase } from '@/application/use-cases/SearchRepositoriesUseCase';
import { GitHubRepository } from '@/infrastructure/github/GitHubRepository';
import { GitLabRepository } from '@/infrastructure/gitlab/GitLabRepository';
import { AxiosClient } from '../http/AxiosClient';


export function createDependencies(
  dataSource: DataSource,
) {
  const axiosClient = new AxiosClient();

  const repository =
    dataSource === 'github'
      ? new GitHubRepository(axiosClient)
      : new GitLabRepository(axiosClient);

  return {
    searchRepositories: new SearchRepositoriesUseCase(repository),
    getRepositoryDetails: new GetDetailsUseCase(repository),
    getRepositoryIssues: new GetRepositoryIssuesUseCase(repository),
  };
}