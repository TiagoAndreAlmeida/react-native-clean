import { useInfiniteQuery } from '@tanstack/react-query';

import { useDataSource } from '@/presentation/providers/DataSourceProvider';
import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';

export function useRepositoryIssues() {
    const { dataSource, dependencies } = useDataSource();
    const { repository } = useSelectedRepository();

    const fullName = repository?.fullName ?? '';

    const queryResult = useInfiniteQuery({
        queryKey: ['repository-issues', dataSource, fullName],

        initialPageParam: 1,

        queryFn: ({ pageParam }) => {
            if (!repository) {
                throw new Error('Nenhum repositório selecionado.');
            }

            return dependencies.getRepositoryIssues.execute({
                reference: {
                    fullPath: repository.fullName,
                },
                page: pageParam,
            });
        },

        getNextPageParam: (lastPage) => {
            return lastPage.hasNextPage
                ? lastPage.page + 1
                : undefined;
        },

        enabled: Boolean(repository),

        staleTime: 30_000,
    });

    const issues =
        queryResult.data?.pages.flatMap(
            (page) => page.items,
        ) ?? [];

    return {
        ...queryResult,
        issues,
    };
}