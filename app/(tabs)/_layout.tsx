import React from 'react';
import { Tabs } from 'expo-router';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/theme';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Repositórios',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="repo" size={size || 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="design-system"
        options={{
          title: 'Design System',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette-outline" size={size || 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
