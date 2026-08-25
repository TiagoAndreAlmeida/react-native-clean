import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { FontSizeKey, FontWeightKey } from '@/shared/theme/tokens/typography';

export type TextVariant = 'body' | 'caption' | 'label' | 'code';
export type TextColor = 'default' | 'secondary' | 'muted' | 'primary' | 'success' | 'warning' | 'danger' | 'inverse';

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: FontSizeKey;
  weight?: FontWeightKey;
  color?: TextColor;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size = 'md',
  weight = 'regular',
  color = 'default',
  align = 'left',
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const getColor = (): string => {
    switch (color) {
      case 'secondary':
        return theme.colors.textSecondary;
      case 'muted':
        return theme.colors.muted;
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'danger':
        return theme.colors.danger;
      case 'inverse':
        return theme.colors.onPrimary;
      case 'default':
      default:
        return theme.colors.text;
    }
  };

  const getFontSize = (): number => {
    if (variant === 'caption') return theme.typography.fontSize.xs;
    if (variant === 'label') return theme.typography.fontSize.sm;
    if (variant === 'code') return theme.typography.fontSize.sm;
    return theme.typography.fontSize[size] || theme.typography.fontSize.md;
  };

  const getLineHeight = (): number => {
    if (variant === 'caption') return theme.typography.lineHeight.xs;
    if (variant === 'label') return theme.typography.lineHeight.sm;
    return theme.typography.lineHeight[size] || theme.typography.lineHeight.md;
  };

  const textStyle: TextStyle = {
    color: getColor(),
    fontSize: getFontSize(),
    lineHeight: getLineHeight(),
    fontWeight: theme.typography.fontWeight[weight],
    textAlign: align,
    fontFamily: variant === 'code' ? 'monospace' : undefined,
  };

  return (
    <RNText style={[textStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};
