import { ViewStyle } from 'react-native';
import { typography } from './tokens/typography';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | 'light' | 'dark';

export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'full';
export type ShadowToken = 'sm' | 'md' | 'lg';

export interface ThemeColors {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySubtle: string;

  // Surfaces & Backgrounds
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceHover: string;

  // Content & Typography
  text: string;
  textSecondary: string;
  muted: string;

  // Borders
  border: string;
  borderSubtle: string;
  borderActive: string;

  // Semantic Status
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  info: string;
  infoSubtle: string;

  // On Color Tokens (for contrast)
  onPrimary: string;
  onSurface: string;
  onBackground: string;

  // Providers & Languages
  providers: {
    github: string;
    gitlab: string;
  };
  languages: Record<string, string>;
}

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  spacing: Record<SpacingToken, number>;
  sizes: Record<SizeToken, number>;
  radius: Record<RadiusToken, number>;
  typography: typeof typography;
  shadows: Record<ShadowToken, ViewStyle>;
}
