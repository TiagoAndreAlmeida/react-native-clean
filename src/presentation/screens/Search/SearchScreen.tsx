import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme';
import {
  Heading,
  Text,
  Input,
  Card,
  Avatar,
  Badge,
  Button,
} from '@/presentation/components';

export interface SearchScreenProps {
  onSelectRepository?: (id: string) => void;
  activeProvider?: 'github' | 'gitlab';
  onChangeProvider?: (provider: 'github' | 'gitlab') => void;
}

// Initial mock data to validate layout matching docs/home-page.png
const MOCK_REPOSITORIES = [
  {
    id: 'facebook/react-native',
    name: 'facebook / react-native',
    description: 'A framework for building native applications using React',
    language: 'JavaScript',
    stars: '120k',
    forks: '24.5k',
    watchers: '3.1k',
    avatar: 'https://avatars.githubusercontent.com/u/69631',
  },
  {
    id: 'callstack/react-native-paper',
    name: 'callstack / react-native-paper',
    description: 'Material Design components for React Native',
    language: 'TypeScript',
    stars: '10.2k',
    forks: '2.2k',
    watchers: '234',
    avatar: 'https://avatars.githubusercontent.com/u/13859391',
  },
  {
    id: 'software-mansion/react-native-reanimated',
    name: 'software-mansion / react-native-reanimated',
    description: "React Native's animated library",
    language: 'TypeScript',
    stars: '9.6k',
    forks: '1.5k',
    watchers: '180',
    avatar: 'https://avatars.githubusercontent.com/u/9284419',
  },
  {
    id: 'gorhom/react-native-bottom-sheet',
    name: 'gorhom / react-native-bottom-sheet',
    description: 'Highly customizable bottom sheet for React Native',
    language: 'TypeScript',
    stars: '7.8k',
    forks: '1.3k',
    watchers: '156',
    avatar: 'https://avatars.githubusercontent.com/u/688480',
  },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectRepository,
  activeProvider = 'github',
  onChangeProvider,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('react native');
  const [provider, setProvider] = useState<'github' | 'gitlab'>(activeProvider);

  const handleProviderToggle = () => {
    const next = provider === 'github' ? 'gitlab' : 'github';
    setProvider(next);
    onChangeProvider?.(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            borderBottomColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <Heading level="h3">Repositórios</Heading>

        {/* Provider Switcher Badge */}
        <TouchableOpacity
          onPress={handleProviderToggle}
          activeOpacity={0.7}
          style={[
            styles.providerBadge,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text size="sm" weight="semibold">
            {provider === 'github' ? '🐙 GitHub' : '🦊 GitLab'}
          </Text>
          <Text size="xs" color="muted">
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar repositórios..."
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
          />
        </View>

        {/* Filters and Counter */}
        <View style={styles.metaRow}>
          <Button variant="outline" size="sm">
            Filtros
          </Button>
          <Text variant="caption" color="secondary">
            Resultados: {MOCK_REPOSITORIES.length}
          </Text>
        </View>

        {/* Repositories List */}
        <View style={styles.list}>
          {MOCK_REPOSITORIES.map((repo) => (
            <Card
              key={repo.id}
              variant="default"
              padding="md"
              onPress={() => onSelectRepository?.(repo.id)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Avatar uri={repo.avatar} name={repo.name} size="sm" />
                <View style={styles.cardTitleContainer}>
                  <Text weight="bold" size="md">
                    {repo.name}
                  </Text>
                  <Text
                    variant="body"
                    size="sm"
                    color="secondary"
                    numberOfLines={2}
                  >
                    {repo.description}
                  </Text>
                </View>
                <Text color="muted" size="md">
                  ›
                </Text>
              </View>

              {/* Card Footer: Language & Metrics */}
              <View style={styles.cardFooter}>
                <Badge
                  label={repo.language}
                  size="sm"
                  dotColor={
                    theme.colors.languages[repo.language] ||
                    theme.colors.languages.default
                  }
                />
                <View style={styles.metrics}>
                  <Text variant="caption" color="secondary">
                    ★ {repo.stars}
                  </Text>
                  <Text variant="caption" color="secondary">
                    ⑂ {repo.forks}
                  </Text>
                  <Text variant="caption" color="secondary">
                    👁 {repo.watchers}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
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
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  scrollContent: {
    padding: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitleContainer: {
    flex: 1,
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
