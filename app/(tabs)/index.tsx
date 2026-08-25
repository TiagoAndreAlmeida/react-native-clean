import React from 'react';
import { useRouter } from 'expo-router';
import { SearchScreen } from '@/presentation/screens/Search';

export default function SearchRoute() {
  const router = useRouter();

  return (
    <SearchScreen
      onSelectRepository={(id) => {
        router.push(`/repository/${encodeURIComponent(id)}` as any);
      }}
    />
  );
}
