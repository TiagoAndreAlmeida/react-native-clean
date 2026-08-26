import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react';

import {
  createDependencies,
  type DataSource,
} from '@/infrastructure/di/createDependencies';

type DataSourceContextValue = {
  dataSource: DataSource;
  setDataSource: (dataSource: DataSource) => void;
  dependencies: ReturnType<typeof createDependencies>;
};

const DataSourceContext = createContext<
  DataSourceContextValue | undefined
>(undefined);

export function DataSourceProvider({
  children,
}: PropsWithChildren) {
  const [dataSource, setDataSource] =
    useState<DataSource>('github');

  const dependencies = useMemo(
    () => createDependencies(dataSource),
    [dataSource],
  );

  return (
    <DataSourceContext.Provider
      value={{
        dataSource,
        setDataSource,
        dependencies,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const context = useContext(DataSourceContext);

  if (!context) {
    throw new Error(
      'useDataSource deve ser utilizado dentro de DataSourceProvider.',
    );
  }

  return context;
}