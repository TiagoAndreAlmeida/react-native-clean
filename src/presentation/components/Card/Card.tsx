import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/shared/theme';
import { SpacingToken, RadiusToken } from '@/shared/theme/types';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'subtle';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  selected?: boolean;
  padding?: SpacingToken;
  radius?: RadiusToken;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  selected = false,
  padding = 'md',
  radius = 'lg',
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: selected ? theme.colors.borderActive : theme.colors.border,
        };
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? theme.colors.borderActive : 'transparent',
          ...theme.shadows.md,
        };
      case 'subtle':
        return {
          backgroundColor: theme.colors.surfaceSubtle,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? theme.colors.borderActive : 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: selected ? theme.colors.borderActive : theme.colors.border,
          ...theme.shadows.sm,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.radius[radius],
    padding: theme.spacing[padding],
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
