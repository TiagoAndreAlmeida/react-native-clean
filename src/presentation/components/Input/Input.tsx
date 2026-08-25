import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onClear,
  disabled = false,
  containerStyle,
  inputStyle,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = (): string => {
    if (error) return theme.colors.danger;
    if (isFocused) return theme.colors.borderActive;
    return theme.colors.border;
  };

  const getBackgroundColor = (): string => {
    if (disabled) return theme.colors.surfaceSubtle;
    return theme.colors.surface;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="label" weight="medium" color="default" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          value={value}
          editable={!disabled}
          placeholderTextColor={placeholderTextColor || theme.colors.muted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: disabled ? theme.colors.muted : theme.colors.text,
              fontSize: theme.typography.fontSize.md,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {onClear && value && value.length > 0 && !disabled ? (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text color="muted" size="sm" weight="semibold">
              ✕
            </Text>
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={styles.feedback}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="muted" style={styles.feedback}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  leftIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedback: {
    marginTop: 4,
  },
});
