import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Text, Card } from '@/presentation/components';

export const CardsSection: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string>('github');

  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🃏 Cards & Superfícies
      </Heading>

      <View style={styles.group}>
        <Card variant="default" padding="sm">
          <Heading level="h4">Card Padrão</Heading>
          <Text variant="body" color="secondary">
            Superfície com borda sutil e sombra suave.
          </Text>
        </Card>

        <Card variant="elevated" padding="sm">
          <Heading level="h4">Card Elevado</Heading>
          <Text variant="body" color="secondary">
            Superfície com maior elevação de sombra.
          </Text>
        </Card>

        <Card
          variant="default"
          selected={selectedCard === 'github'}
          onPress={() => setSelectedCard('github')}
          padding="sm"
        >
          <Heading level="h4">Card Selecionável (GitHub) {selectedCard === 'github' ? '✓' : ''}</Heading>
          <Text variant="body" color="secondary">
            Clique para alternar a seleção ativa.
          </Text>
        </Card>

        <Card
          variant="default"
          selected={selectedCard === 'gitlab'}
          onPress={() => setSelectedCard('gitlab')}
          padding="sm"
        >
          <Heading level="h4">Card Selecionável (GitLab) {selectedCard === 'gitlab' ? '✓' : ''}</Heading>
          <Text variant="body" color="secondary">
            Clique para alternar a seleção ativa.
          </Text>
        </Card>
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
    gap: 12,
  },
});
