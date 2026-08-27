import {
  Avatar,
  Badge,
  Button,
  Card,
  Heading,
  Text,
} from '@/presentation/components';
import { useRepositoryIssues } from '@/presentation/hooks/useIssueRepository';
import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';
import { useTheme } from '@/shared/theme';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface IssuesScreenProps {
  onGoBack?: () => void;
}

function formatRelativeDate(date: Date): string {
  const now = Date.now();
  const createdAt = date.getTime();

  const difference = Math.max(
    0,
    now - createdAt,
  );

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (difference < minute) {
    return 'agora';
  }

  if (difference < hour) {
    const value = Math.floor(
      difference / minute,
    );

    return `há ${value} min`;
  }

  if (difference < day) {
    const value = Math.floor(
      difference / hour,
    );

    return `há ${value} h`;
  }

  if (difference < month) {
    const value = Math.floor(
      difference / day,
    );

    return `há ${value} ${value === 1 ? 'dia' : 'dias'}`;
  }

  if (difference < year) {
    const value = Math.floor(
      difference / month,
    );

    return `há ${value} ${value === 1 ? 'mês' : 'meses'}`;
  }

  const value = Math.floor(
    difference / year,
  );

  return `há ${value} ${value === 1 ? 'ano' : 'anos'}`;
}

export const IssuesScreen: React.FC<
  IssuesScreenProps
> = ({
  onGoBack,
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const { repository } = useSelectedRepository();

    const {
      issues,
      isPending,
      isError,
      error,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      refetch,
      isRefetching,
    } = useRepositoryIssues();

    const renderEmptyState = () => {
      if (isPending) {
        return null;
      }

      return (
        <View style={styles.emptyState}>
          <Text color="secondary">
            {isError
              ? error instanceof Error
                ? error.message
                : 'Não foi possível carregar as issues.'
              : 'Nenhuma issue encontrada.'}
          </Text>

          {isError && (
            <Button
              variant="outline"
              size="sm"
              onPress={() => refetch()}
            >
              Tentar novamente
            </Button>
          )}
        </View>
      );
    };

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Math.max(insets.top, 16) + 8,
              borderBottomColor:
                theme.colors.borderSubtle,
            },
          ]}
        >
          {onGoBack ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={onGoBack}
            >
              ← Voltar
            </Button>
          ) : (
            <View style={styles.headerSide} />
          )}

          <Heading level="h4">
            Issues
          </Heading>

          <View style={styles.headerSide} />
        </View>

        {isPending ? (
          <View style={styles.loadingState}>
            <Text color="secondary">
              Carregando issues...
            </Text>
          </View>
        ) : (
          <FlatList
            data={issues}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom:
                  Math.max(insets.bottom, 16) + 32,
              },
              issues.length === 0 &&
              styles.emptyContent,
            ]}
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
            ListEmptyComponent={
              renderEmptyState()
            }
            renderItem={({ item }) => (
              <Card
                variant="default"
                padding="md"
              >
                <View style={styles.issueHeader}>
                  <Badge
                    label="Aberta"
                    variant="success"
                    size="sm"
                  />

                  <Text
                    color="muted"
                    size="xs"
                  >
                    {formatRelativeDate(
                      item.createdAt,
                    )}
                  </Text>
                </View>

                <View style={styles.issueTitle}>
                  <Heading level="h4">
                    {item.title}
                  </Heading>
                </View>

                <View style={styles.author}>
                  <Avatar
                    uri={
                      item.author.avatarUrl ??
                      undefined
                    }
                    name={item.author.name}
                    size="sm"
                  />

                  <Text
                    color="secondary"
                    size="sm"
                  >
                    {item.author.name}
                  </Text>
                </View>

                {item.labels.length > 0 && (
                  <View style={styles.labels}>
                    {item.labels.map((label) => (
                      <Badge
                        key={label}
                        label={label}
                        size="sm"
                      />
                    ))}
                  </View>
                )}

                {repository && (
                  <Text
                    color="muted"
                    size="xs"
                  >
                    {repository.fullName}
                  </Text>
                )}
              </Card>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footer}>
                  <Text color="secondary">
                    Carregando mais...
                  </Text>
                </View>
              ) : null
            }
          />
        )}
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

  headerSide: {
    width: 60,
  },

  content: {
    padding: 16,
  },

  emptyContent: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: {
    height: 12,
  },

  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  issueTitle: {
    marginTop: 10,
  },

  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },

  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});