import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme';
import { Heading, Text, Card, Button, Avatar, Badge } from '@/presentation/components';

export interface RepositoryDetailsScreenProps {
  repositoryId: string;
  onNavigateToIssues?: () => void;
  onGoBack?: () => void;
}

export const RepositoryDetailsScreen: React.FC<RepositoryDetailsScreenProps> = ({
  repositoryId,
  onNavigateToIssues,
  onGoBack,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            borderBottomColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {onGoBack && (
          <Button variant="ghost" size="sm" onPress={onGoBack}>
            ← Voltar
          </Button>
        )}
        <Heading level="h4">Detalhes</Heading>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
      >
        <Card variant="default" padding="lg">
          <View style={styles.ownerRow}>
            <Avatar name={repositoryId} size="lg" />
            <View style={styles.titleInfo}>
              <Heading level="h3">{repositoryId}</Heading>
              <Badge label="Repositório Público" variant="default" />
            </View>
          </View>

          <Text color="secondary" style={styles.description}>
            Estrutura da tela de detalhes preparada para integração com Use Case e Cache.
          </Text>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={onNavigateToIssues}
            style={styles.actionBtn}
          >
            Ver Issues
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  titleInfo: {
    flex: 1,
    gap: 6,
  },
  description: {
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});
