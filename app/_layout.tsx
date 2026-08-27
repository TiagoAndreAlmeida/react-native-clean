import { DataSourceProvider } from '@/presentation/providers/DataSourceProvider';
import { SelectedRepositoryProvider } from '@/presentation/providers/SelectedRepositoryProvider';
import { ThemeProvider, useTheme } from '@/shared/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function RootNavigation() {
  const { isDark, theme } = useTheme();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="repository/[id]/index"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="repository/[id]/issues"
          options={{ presentation: 'card', headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <DataSourceProvider>
          <SelectedRepositoryProvider>
            <RootNavigation />
          </SelectedRepositoryProvider>
        </DataSourceProvider>
      </QueryClientProvider>
      <Toast />
    </ThemeProvider>
  );
}
