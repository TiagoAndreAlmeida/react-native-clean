import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';
import { Heading } from '../Text/Heading';
import { Button } from '../Button/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente',
  icon,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Heading level="h4" align="center" color="default" style={styles.title}>
        {title}
      </Heading>
      <Text variant="body" color="secondary" align="center" style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button variant="primary" size="sm" onPress={onRetry} style={styles.retryButton}>
          {retryLabel}
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
  message: {
    marginBottom: 20,
    maxWidth: 300,
  },
  retryButton: {
    minWidth: 140,
  },
});
