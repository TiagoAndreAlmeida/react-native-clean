import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '@/shared/theme';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface HeadingProps extends RNTextProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  align?: TextStyle['textAlign'];
  color?: 'default' | 'secondary' | 'primary';
  style?: TextStyle;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 'h2',
  align = 'left',
  color = 'default',
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const getHeadingStyles = (): { fontSize: number; lineHeight: number; fontWeight: TextStyle['fontWeight'] } => {
    switch (level) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize['3xl'],
          lineHeight: theme.typography.lineHeight['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          lineHeight: theme.typography.lineHeight['2xl'],
          fontWeight: theme.typography.fontWeight.bold,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.xl,
          lineHeight: theme.typography.lineHeight.xl,
          fontWeight: theme.typography.fontWeight.semibold,
        };
      case 'h4':
      default:
        return {
          fontSize: theme.typography.fontSize.lg,
          lineHeight: theme.typography.lineHeight.lg,
          fontWeight: theme.typography.fontWeight.semibold,
        };
    }
  };

  const getColor = (): string => {
    switch (color) {
      case 'secondary':
        return theme.colors.textSecondary;
      case 'primary':
        return theme.colors.primary;
      case 'default':
      default:
        return theme.colors.text;
    }
  };

  const { fontSize, lineHeight, fontWeight } = getHeadingStyles();

  const headingStyle: TextStyle = {
    color: getColor(),
    fontSize,
    lineHeight,
    fontWeight,
    textAlign: align,
  };

  return (
    <RNText style={[headingStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};
