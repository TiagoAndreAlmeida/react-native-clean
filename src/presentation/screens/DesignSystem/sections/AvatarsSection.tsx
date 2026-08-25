import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Card, Avatar } from '@/presentation/components';

export const AvatarsSection: React.FC = () => {
  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        👤 Avatares
      </Heading>

      <View style={styles.row}>
        <Avatar size="xs" name="React Native" />
        <Avatar size="sm" name="TypeScript" />
        <Avatar size="md" name="Facebook React" />
        <Avatar size="lg" name="GitLab User" />
        <Avatar size="xl" name="Alymente App" />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
