export const primitiveColors = {
  // Brand / Monochromatic Palette (GitHub Style: Black, White & Grays)
  mono: {
    black: '#000000',
    white: '#FFFFFF',
    charcoal: '#1F2328', // GitHub light primary / text
    darkCanvas: '#0D1117', // GitHub dark background
    darkSurface: '#161B22', // GitHub dark surface
    darkSubtle: '#21262D', // GitHub dark border/subtle
    darkBorder: '#30363D', // GitHub dark border active/muted
    lightCanvas: '#F6F8FA', // GitHub light background
    lightBorder: '#D0D7DE', // GitHub light border
    lightSubtle: '#EFF1F3', // GitHub light subtle
  },
  // Grays / Scale
  gray: {
    0: '#FFFFFF',
    50: '#F6F8FA',
    100: '#EFF1F3',
    200: '#D0D7DE',
    300: '#AFB8C1',
    400: '#8C959F',
    500: '#656D76',
    600: '#424A53',
    700: '#24292F',
    800: '#1F2328',
    900: '#0F1115',
    950: '#000000',
  },
  // Semantic Primitives (GitHub style)
  green: {
    light: '#1A7F37',
    dark: '#3FB950',
    lightSubtle: '#DAFBE1',
    darkSubtle: 'rgba(63, 185, 80, 0.15)',
  },
  amber: {
    light: '#9A6700',
    dark: '#D29922',
    lightSubtle: '#FFF8C5',
    darkSubtle: 'rgba(210, 153, 34, 0.15)',
  },
  red: {
    light: '#CF222E',
    dark: '#F85149',
    lightSubtle: '#FFEBE9',
    darkSubtle: 'rgba(248, 81, 73, 0.15)',
  },
  blue: {
    light: '#0969DA',
    dark: '#58A6FF',
    lightSubtle: '#DDF4FF',
    darkSubtle: 'rgba(88, 166, 255, 0.15)',
  },
  // Provider Specific
  providers: {
    github: '#24292F',
    gitlab: '#FC6D26',
  },
  // Programming Languages Colors (matches GitHub repo language indicators)
  languages: {
    JavaScript: '#F7DF1E',
    TypeScript: '#3178C6',
    Python: '#3776AB',
    Kotlin: '#7F52FF',
    Dart: '#0175C2',
    Java: '#B07219',
    Swift: '#F05138',
    Go: '#00ADD8',
    Rust: '#DEA584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#F34B7D',
    'C#': '#178600',
    HTML: '#E34C26',
    CSS: '#563D7C',
    default: '#656D76',
  } as Record<string, string>,
} as const;
