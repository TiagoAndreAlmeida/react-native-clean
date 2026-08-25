import { primitiveColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { sizes } from './tokens/sizes';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { shadows } from './tokens/shadows';
import { Theme, ThemeColors } from './types';

export const lightColors: ThemeColors = {
  // Brand / Monochromatic (GitHub Light)
  primary: primitiveColors.gray[800], // #1F2328
  primaryLight: primitiveColors.gray[600], // #424A53
  primaryDark: primitiveColors.mono.black, // #000000
  primarySubtle: primitiveColors.mono.lightSubtle, // #EFF1F3

  // Surfaces & Backgrounds
  background: primitiveColors.mono.lightCanvas, // #F6F8FA
  surface: primitiveColors.mono.white, // #FFFFFF
  surfaceSubtle: primitiveColors.mono.lightSubtle, // #EFF1F3
  surfaceHover: '#EAEEF2',

  // Content & Typography
  text: primitiveColors.gray[800], // #1F2328
  textSecondary: primitiveColors.gray[500], // #656D76
  muted: primitiveColors.gray[400], // #8C959F

  // Borders
  border: primitiveColors.mono.lightBorder, // #D0D7DE
  borderSubtle: '#E8ECF0',
  borderActive: primitiveColors.gray[800], // #1F2328

  // Semantic Status (GitHub Primer Light)
  success: primitiveColors.green.light, // #1A7F37
  successSubtle: primitiveColors.green.lightSubtle, // #DAFBE1
  warning: primitiveColors.amber.light, // #9A6700
  warningSubtle: primitiveColors.amber.lightSubtle, // #FFF8C5
  danger: primitiveColors.red.light, // #CF222E
  dangerSubtle: primitiveColors.red.lightSubtle, // #FFEBE9
  info: primitiveColors.blue.light, // #0969DA
  infoSubtle: primitiveColors.blue.lightSubtle, // #DDF4FF

  // On Color Tokens
  onPrimary: primitiveColors.mono.white,
  onSurface: primitiveColors.gray[800],
  onBackground: primitiveColors.gray[800],

  // Providers & Languages
  providers: primitiveColors.providers,
  languages: primitiveColors.languages,
};

export const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  colors: lightColors,
  spacing,
  sizes,
  radius,
  typography,
  shadows,
};
