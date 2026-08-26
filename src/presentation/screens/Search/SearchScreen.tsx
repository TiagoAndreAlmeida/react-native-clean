import {
  Avatar,
  Badge,
  Card,
  Heading,
  Input,
  Text
} from '@/presentation/components';
import { useSearchRepositories } from '@/presentation/hooks/useSearchRepositories';
import { useDataSource } from '@/presentation/providers/DataSourceProvider';
import { useTheme } from '@/shared/theme';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SearchScreenProps {
  onSelectRepository?: (id: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectRepository
}) => {
  const { theme } = useTheme();
  const { setDataSource, dataSource } = useDataSource();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('react native');
  const {
    repositories,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSearchRepositories({
    query,
  });

  const handleProviderToggle = () => {
    const next = dataSource === 'github' ? 'gitlab' : 'github';
    setDataSource(next);
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
            {dataSource === 'github' ? '🐙 GitHub' : '🦊 GitLab'}
          </Text>
          <Text size="xs" color="muted">
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={repositories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(insets.bottom, 16) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => {
          if (
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Input
                placeholder="Buscar repositórios..."
                value={query}
                onChangeText={setQuery}
                onClear={() => setQuery('')}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Card
            variant="default"
            padding="md"
            onPress={() =>
              onSelectRepository?.(item.id)
            }
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Avatar
                uri={item.owner.avatarUrl ?? undefined}
                name={item.owner.name}
                size="sm"
              />

              <View style={styles.cardTitleContainer}>
                <Text weight="bold" size="md">
                  {item.fullName}
                </Text>

                <Text
                  variant="body"
                  size="sm"
                  color="secondary"
                  numberOfLines={2}
                >
                  {item.description ?? 'Sem descrição'}
                </Text>
              </View>

              <Text color="muted" size="md">
                ›
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Badge
                label={item.language ?? 'N/A'}
                size="sm"
                dotColor={
                  theme.colors.languages[
                  item.language ?? ''
                  ] ||
                  theme.colors.languages.default
                }
              />

              <View style={styles.metrics}>
                <Text variant="caption" color="secondary">
                  ★ {item.stars}
                </Text>

                <Text variant="caption" color="secondary">
                  ⑂ {item.forks}
                </Text>

                <Text variant="caption" color="secondary">
                  👁 {item.watchers}
                </Text>
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
        ListEmptyComponent={
          !isPending ? (
            <View>
              <Text color="secondary">
                {isError
                  ? 'Não foi possível carregar os repositórios.'
                  : 'Nenhum repositório encontrado.'}
              </Text>
            </View>
          ) : null
        }
      />

      {/* <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {MOCK_REPOSITORIES.map((repo) => (
            
          ))}
        </View>
      </ScrollView> */}
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
