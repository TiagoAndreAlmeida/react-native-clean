import { useInfiniteQuery } from '@tanstack/react-query';

import { useDataSource } from '@/presentation/providers/DataSourceProvider';

interface UseSearchRepositoriesParams {
  query: string;
}

export function useSearchRepositories({
  query,
}: UseSearchRepositoriesParams) {
  const { dataSource, dependencies } = useDataSource();

  const normalizedQuery = query.trim();

  const queryResult = useInfiniteQuery({
    queryKey: ['repositories', dataSource, normalizedQuery],

    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      return dependencies.searchRepositories.execute({
        query: normalizedQuery,
        page: pageParam,
      });
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
        return undefined;
      }

      return lastPage.page + 1;
    },

    enabled: normalizedQuery.length > 0
  });

  const repositories =
    queryResult.data?.pages.flatMap(
      (page) => page.items,
    ) ?? [];

  return {
    ...queryResult,
    repositories,
  };
}