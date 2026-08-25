import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Text, Card, Button } from '@/presentation/components';

export const ButtonsSection: React.FC = () => {
  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🔘 Botões
      </Heading>

      <Text variant="label" color="secondary" style={styles.groupLabel}>
        Variantes
      </Text>
      <View style={styles.row}>
        <Button variant="primary">Primário</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </View>

      <Text variant="label" color="secondary" style={styles.groupLabel}>
        Tamanhos
      </Text>
      <View style={styles.row}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </View>

      <Text variant="label" color="secondary" style={styles.groupLabel}>
        Estados
      </Text>
      <View style={styles.row}>
        <Button loading>Carregando</Button>
        <Button disabled>Desabilitado</Button>
        <Button fullWidth>Largura Total</Button>
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
  groupLabel: {
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
});
