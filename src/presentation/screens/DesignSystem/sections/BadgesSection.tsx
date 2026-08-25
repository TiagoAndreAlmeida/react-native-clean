import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Heading, Text, Card, Badge } from '@/presentation/components';

export const BadgesSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🏷️ Badges & Tags
      </Heading>

      <Text variant="label" color="secondary" style={styles.groupLabel}>
        Status e Variantes
      </Text>
      <View style={styles.row}>
        <Badge label="Padrão" variant="default" />
        <Badge label="Primário" variant="primary" />
        <Badge label="Aberta" variant="success" />
        <Badge label="Atenção" variant="warning" />
        <Badge label="Erro" variant="danger" />
        <Badge label="Outline" variant="outline" />
      </View>

      <Text variant="label" color="secondary" style={styles.groupLabel}>
        Linguagens de Programação
      </Text>
      <View style={styles.row}>
        <Badge
          label="TypeScript"
          variant="default"
          dotColor={theme.colors.languages.TypeScript}
        />
        <Badge
          label="JavaScript"
          variant="default"
          dotColor={theme.colors.languages.JavaScript}
        />
        <Badge
          label="Python"
          variant="default"
          dotColor={theme.colors.languages.Python}
        />
        <Badge
          label="Dart"
          variant="default"
          dotColor={theme.colors.languages.Dart}
        />
        <Badge
          label="Kotlin"
          variant="default"
          dotColor={theme.colors.languages.Kotlin}
        />
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
