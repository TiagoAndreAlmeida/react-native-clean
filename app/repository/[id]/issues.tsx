import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IssuesScreen } from '@/presentation/screens/Issues';

export default function IssuesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const repositoryId = id ? decodeURIComponent(id) : '';

  return (
    <IssuesScreen
      repositoryId={repositoryId}
      onGoBack={() => {
        router.back();
      }}
    />
  );
}
