import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from 'react';

import type { Repository } from '@/domain/entities/Repository';

interface SelectedRepositoryContextValue {
    repository: Repository | null;
    setRepository: (repository: Repository) => void;
    clearRepository: () => void;
}

const SelectedRepositoryContext = createContext<
    SelectedRepositoryContextValue | undefined
>(undefined);

export function SelectedRepositoryProvider({
    children,
}: PropsWithChildren) {
    const [repository, setRepository] =
        useState<Repository | null>(null);

    const clearRepository = () => {
        setRepository(null);
    };

    return (
        <SelectedRepositoryContext.Provider
            value={{
                repository,
                setRepository,
                clearRepository,
            }}
        >
            {children}
        </SelectedRepositoryContext.Provider>
    );
}

export function useSelectedRepository() {
    const context = useContext(
        SelectedRepositoryContext,
    );

    if (!context) {
        throw new Error(
            'useSelectedRepository deve ser utilizado dentro de SelectedRepositoryProvider.',
        );
    }

    return context;
}