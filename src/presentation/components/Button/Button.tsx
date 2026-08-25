import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  onPress,
  ...rest
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const getSizeStyles = (): {
    paddingVertical: number;
    paddingHorizontal: number;
    height: number;
    gap: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          height: 36,
          gap: theme.spacing.xs,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          height: 52,
          gap: theme.spacing.sm,
        };
      case 'md':
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          height: 44,
          gap: theme.spacing.xs,
        };
    }
  };

  const getVariantStyles = (): {
    container: ViewStyle;
    textColor: 'default' | 'inverse' | 'secondary' | 'danger' | 'primary' | 'muted';
    indicatorColor: string;
  } => {
    switch (variant) {
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: isDisabled ? theme.colors.borderSubtle : theme.colors.border,
          },
          textColor: isDisabled ? 'muted' : 'default',
          indicatorColor: theme.colors.text,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          textColor: isDisabled ? 'muted' : 'default',
          indicatorColor: theme.colors.text,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.colors.danger,
            borderWidth: 0,
          },
          textColor: 'inverse',
          indicatorColor: theme.colors.onPrimary,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
          },
          textColor: 'inverse',
          indicatorColor: theme.colors.onPrimary,
        };
    }
  };

  const sizeStyle = getSizeStyles();
  const variantStyle = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    ...sizeStyle,
    ...variantStyle.container,
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      case 'md':
      default:
        return 'md';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      onPress={onPress}
      style={[containerStyle, style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.indicatorColor} />
      ) : (
        <>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          {typeof children === 'string' ? (
            <Text
              size={getTextSize()}
              weight="semibold"
              color={variantStyle.textColor}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
