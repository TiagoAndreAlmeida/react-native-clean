export const sizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type SizeKey = keyof typeof sizes;
