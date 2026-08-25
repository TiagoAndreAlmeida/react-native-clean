import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Text, Card } from '@/presentation/components';

export const TypographySection: React.FC = () => {
  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🔤 Tipografia
      </Heading>

      <View style={styles.group}>
        <Heading level="h1">Heading 1 (30px)</Heading>
        <Heading level="h2">Heading 2 (24px)</Heading>
        <Heading level="h3">Heading 3 (20px)</Heading>
        <Heading level="h4">Heading 4 (18px)</Heading>
      </View>

      <View style={styles.divider} />

      <View style={styles.group}>
        <Text size="xl" weight="bold">
          Text XL Bold (20px)
        </Text>
        <Text size="lg" weight="semibold">
          Text LG Semibold (18px)
        </Text>
        <Text size="md" color="default">
          Text MD Regular (16px) - Padrão do corpo
        </Text>
        <Text size="sm" color="secondary">
          Text SM Regular (14px) - Secundário
        </Text>
        <Text variant="caption" color="muted">
          Text XS / Caption (12px) - Notas e legendas
        </Text>
        <Text variant="code" color="primary">
          const repository = &apos;facebook/react-native&apos;;
        </Text>
      </View>
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
  group: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
});
