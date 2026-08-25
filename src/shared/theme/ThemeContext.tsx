import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { Theme, ThemePreference, ThemeMode } from './types';

interface ThemeContextValue {
  theme: Theme;
  themePreference: ThemePreference;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialPreference?: ThemePreference;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialPreference = 'system',
}) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>(initialPreference);

  const resolvedMode: ThemeMode = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference, systemColorScheme]);

  const activeTheme = useMemo(() => {
    return resolvedMode === 'dark' ? darkTheme : lightTheme;
  }, [resolvedMode]);

  const toggleTheme = useCallback(() => {
    setThemePreference((current) => {
      if (current === 'system') {
        return resolvedMode === 'dark' ? 'light' : 'dark';
      }
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [resolvedMode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: activeTheme,
      themePreference,
      themeMode: resolvedMode,
      isDark: resolvedMode === 'dark',
      setThemePreference,
      toggleTheme,
    }),
    [activeTheme, themePreference, resolvedMode, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
