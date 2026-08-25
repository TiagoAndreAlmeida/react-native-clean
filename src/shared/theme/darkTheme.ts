import { primitiveColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { sizes } from './tokens/sizes';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { shadows } from './tokens/shadows';
import { Theme, ThemeColors } from './types';

export const darkColors: ThemeColors = {
  // Brand / Monochromatic (GitHub Dark High-Contrast)
  primary: '#F0F6FC', // Clean crisp white/off-white
  primaryLight: primitiveColors.mono.white,
  primaryDark: primitiveColors.gray[200],
  primarySubtle: 'rgba(240, 246, 252, 0.1)',

  // Surfaces & Backgrounds
  background: primitiveColors.mono.darkCanvas, // #0D1117
  surface: primitiveColors.mono.darkSurface, // #161B22
  surfaceSubtle: primitiveColors.mono.darkSubtle, // #21262D
  surfaceHover: primitiveColors.mono.darkBorder, // #30363D

  // Content & Typography
  text: '#F0F6FC',
  textSecondary: '#9198A1',
  muted: '#6E7681',

  // Borders
  border: primitiveColors.mono.darkBorder, // #30363D
  borderSubtle: primitiveColors.mono.darkSubtle, // #21262D
  borderActive: '#F0F6FC',

  // Semantic Status (GitHub Primer Dark)
  success: primitiveColors.green.dark, // #3FB950
  successSubtle: primitiveColors.green.darkSubtle,
  warning: primitiveColors.amber.dark, // #D29922
  warningSubtle: primitiveColors.amber.darkSubtle,
  danger: primitiveColors.red.dark, // #F85149
  dangerSubtle: primitiveColors.red.darkSubtle,
  info: primitiveColors.blue.dark, // #58A6FF
  infoSubtle: primitiveColors.blue.darkSubtle,

  // On Color Tokens
  onPrimary: primitiveColors.mono.darkCanvas, // #0D1117
  onSurface: '#F0F6FC',
  onBackground: '#F0F6FC',

  // Providers & Languages
  providers: primitiveColors.providers,
  languages: primitiveColors.languages,
};

export const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  colors: darkColors,
  spacing,
  sizes,
  radius,
  typography,
  shadows,
};
