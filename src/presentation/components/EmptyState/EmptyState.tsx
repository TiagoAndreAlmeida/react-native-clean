import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';
import { Heading } from '../Text/Heading';
import { Button } from '../Button/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum resultado encontrado',
  description = 'Tente ajustar sua busca ou filtros para encontrar o que procura.',
  icon,
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Heading level="h4" align="center" style={styles.title}>
        {title}
      </Heading>
      {description && (
        <Text variant="body" color="secondary" align="center" style={styles.description}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onPress={onAction} style={styles.actionButton}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: 8,
  },
});
