import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';

export interface SegmentedControlOption<T extends string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  selectedKey,
  onSelect,
  style,
}: SegmentedControlProps<T>) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceSubtle,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.key === selectedKey;
        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => onSelect(option.key)}
            activeOpacity={0.8}
            style={[
              styles.segment,
              {
                borderRadius: theme.radius.sm,
                backgroundColor: isSelected ? theme.colors.surface : 'transparent',
                ...(isSelected ? theme.shadows.sm : {}),
              },
            ]}
          >
            {option.icon && <View style={styles.icon}>{option.icon}</View>}
            <Text
              size="sm"
              weight={isSelected ? 'semibold' : 'regular'}
              color={isSelected ? 'default' : 'secondary'}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
