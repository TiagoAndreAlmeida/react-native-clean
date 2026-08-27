import { Avatar, Badge, Button, Card, Heading, Text } from '@/presentation/components';
import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';
import { useTheme } from '@/shared/theme';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface RepositoryDetailsScreenProps {
  onNavigateToIssues?: () => void;
  onGoBack?: () => void;
}

export const RepositoryDetailsScreen: React.FC<RepositoryDetailsScreenProps> = ({
  onNavigateToIssues,
  onGoBack,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { repository } = useSelectedRepository();

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
            <Avatar uri={repository?.owner?.avatarUrl} size="lg" />
            <View style={styles.titleInfo}>
              <Heading level="h3">{repository?.name}</Heading>
              <Badge
                label={repository?.language ?? 'N/A'}
                size="sm"
                dotColor={
                  theme.colors.languages[
                  repository?.language ?? ''
                  ] ||
                  theme.colors.languages.default
                }
              />
            </View>
          </View>

          <View style={styles.metrics}>
            <Text variant="caption" color="secondary">
              ★ {repository?.stars}
            </Text>

            <Text variant="caption" color="secondary">
              ⑂ {repository?.forks}
            </Text>

            <Text variant="caption" color="secondary">
              👁 {repository?.watchers}
            </Text>
          </View>

          <Text color="secondary" style={styles.description}>
            {repository?.description || 'Sem descrição disponível.'}
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
    marginTop: 12,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
