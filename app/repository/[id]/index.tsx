import { RepositoryDetailsScreen } from '@/presentation/screens/RepositoryDetails';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function RepositoryDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const repositoryId = id ? decodeURIComponent(id) : '';

  return (
    <RepositoryDetailsScreen
      onNavigateToIssues={() => {
        router.push(`/repository/${encodeURIComponent(repositoryId)}/issues`);
      }}
      onGoBack={() => {
        router.back();
      }}
    />
  );
}
