import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Heading, Text, Card, SegmentedControl } from '@/presentation/components';

export const ThemeSection: React.FC = () => {
  const { themePreference, themeMode, setThemePreference } = useTheme();

  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        🎨 Tema & Aparência
      </Heading>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Modo ativo: <Text weight="bold">{themeMode.toUpperCase()}</Text>
      </Text>

      <SegmentedControl
        options={[
          { key: 'system', label: 'Sistema' },
          { key: 'light', label: 'Claro' },
          { key: 'dark', label: 'Escuro' },
        ]}
        selectedKey={themePreference}
        onSelect={setThemePreference}
        style={styles.segmented}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  segmented: {
    marginTop: 4,
  },
});
