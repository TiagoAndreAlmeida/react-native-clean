import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dotColor?: string;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  dotColor,
  leftIcon,
  style,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): {
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
    textColor: 'default' | 'inverse' | 'secondary' | 'success' | 'warning' | 'danger';
  } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          textColor: 'inverse',
        };
      case 'success':
        return {
          backgroundColor: theme.colors.successSubtle,
          textColor: 'success',
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warningSubtle,
          textColor: 'warning',
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.dangerSubtle,
          textColor: 'danger',
        };
      case 'info':
        return {
          backgroundColor: theme.colors.infoSubtle,
          textColor: 'default',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
          borderWidth: 1,
          textColor: 'secondary',
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surfaceSubtle,
          borderColor: theme.colors.borderSubtle,
          borderWidth: 1,
          textColor: 'secondary',
        };
    }
  };

  const isSmall = size === 'sm';
  const variantStyle = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.full,
    paddingVertical: isSmall ? 2 : 4,
    paddingHorizontal: isSmall ? theme.spacing.xs : theme.spacing.sm,
    backgroundColor: variantStyle.backgroundColor,
    borderColor: variantStyle.borderColor,
    borderWidth: variantStyle.borderWidth,
    gap: 4,
  };

  return (
    <View style={[containerStyle, style]}>
      {dotColor && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              width: isSmall ? 6 : 8,
              height: isSmall ? 6 : 8,
              borderRadius: 4,
            },
          ]}
        />
      )}
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <Text
        variant="caption"
        size={isSmall ? 'xs' : 'sm'}
        weight="medium"
        color={variantStyle.textColor}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    marginRight: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
