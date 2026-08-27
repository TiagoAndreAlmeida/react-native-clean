import { useInfiniteQuery } from '@tanstack/react-query';

import { useDataSource } from '@/presentation/providers/DataSourceProvider';
import { useDebounce } from './useDebounce';

interface UseSearchRepositoriesParams {
  query: string;
}

export function useSearchRepositories({
  query,
}: UseSearchRepositoriesParams) {
  const { dataSource, dependencies } = useDataSource();

  const normalizedQuery = query.trim();

  const debouncedQuery = useDebounce(
    normalizedQuery,
    800,
  );

  const queryResult = useInfiniteQuery({
    queryKey: ['repositories', dataSource, debouncedQuery],

    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      return dependencies.searchRepositories.execute({
        query: debouncedQuery,
        page: pageParam,
      });
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
        return undefined;
      }

      return lastPage.page + 1;
    },

    enabled: debouncedQuery.length > 0
  });

  const repositories =
    queryResult.data?.pages.flatMap(
      (page) => page.items,
    ) ?? [];

  return {
    ...queryResult,
    repositories,
    debouncedQuery
  };
}