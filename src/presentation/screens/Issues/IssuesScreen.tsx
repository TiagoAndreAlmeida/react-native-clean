import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme';
import { Heading, Text, Card, Button, Badge } from '@/presentation/components';

export interface IssuesScreenProps {
  repositoryId: string;
  onGoBack?: () => void;
}

export const IssuesScreen: React.FC<IssuesScreenProps> = ({
  repositoryId,
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
        <Heading level="h4">Issues</Heading>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
      >
        <Card variant="default" padding="md">
          <Badge label="Aberta" variant="success" size="sm" />
          <Heading level="h4" style={{ marginTop: 8 }}>
            #1 [Example Issue] Tela de Issues Estruturada
          </Heading>
          <Text color="secondary" size="sm" style={{ marginTop: 4 }}>
            Repositório: {repositoryId}
          </Text>
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
});
