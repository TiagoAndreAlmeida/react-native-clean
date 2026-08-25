import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RepositoryDetailsScreen } from '@/presentation/screens/RepositoryDetails';

export default function RepositoryDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const repositoryId = id ? decodeURIComponent(id) : '';

  return (
    <RepositoryDetailsScreen
      repositoryId={repositoryId}
      onNavigateToIssues={() => {
        router.push(`/repository/${encodeURIComponent(repositoryId)}/issues` as any);
      }}
      onGoBack={() => {
        router.back();
      }}
    />
  );
}
