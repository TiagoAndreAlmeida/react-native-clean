import { SearchScreen } from '@/presentation/screens/Search';
import { useRouter } from 'expo-router';
import React from 'react';

export default function SearchRoute() {
  const router = useRouter();

  return (
    <SearchScreen
      onSelectRepository={(id) => {
        router.push(`/repository/${encodeURIComponent(id)}`);
      }}
    />
  );
}
