import { DataSourceProvider } from '@/presentation/providers/DataSourceProvider';
import { ThemeProvider, useTheme } from '@/shared/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootNavigation() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
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
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DataSourceProvider>
          <RootNavigation />
        </DataSourceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
