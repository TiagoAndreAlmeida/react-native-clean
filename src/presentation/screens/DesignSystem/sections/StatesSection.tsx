import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Text, Card, EmptyState, ErrorState, Skeleton } from '@/presentation/components';

export const StatesSection: React.FC = () => {
  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🔄 Estados de Feedback (UX)
      </Heading>

      <Text variant="label" color="secondary" style={styles.label}>
        Skeleton Loading
      </Text>
      <View style={styles.skeletonGroup}>
        <Skeleton height={24} width="60%" />
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="80%" />
      </View>

      <Text variant="label" color="secondary" style={styles.label}>
        Empty State
      </Text>
      <Card variant="subtle" padding="sm" style={styles.stateCard}>
        <EmptyState
          title="Nenhum repositório"
          description="Nenhum projeto encontrado para o termo pesquisado."
          actionLabel="Limpar busca"
          onAction={() => {}}
        />
      </Card>

      <Text variant="label" color="secondary" style={styles.label}>
        Error State
      </Text>
      <Card variant="subtle" padding="sm" style={styles.stateCard}>
        <ErrorState
          title="Erro de Conexão"
          message="Limite de requisições excedido ou falha de rede."
          onRetry={() => {}}
        />
      </Card>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
  },
  skeletonGroup: {
    gap: 8,
    marginBottom: 12,
  },
  stateCard: {
    marginBottom: 8,
  },
});
