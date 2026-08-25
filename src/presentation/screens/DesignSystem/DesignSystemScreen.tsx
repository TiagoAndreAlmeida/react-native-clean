import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme';
import { Heading, Text } from '@/presentation/components';
import { ThemeSection } from './sections/ThemeSection';
import { TypographySection } from './sections/TypographySection';
import { ButtonsSection } from './sections/ButtonsSection';
import { InputsSection } from './sections/InputsSection';
import { BadgesSection } from './sections/BadgesSection';
import { CardsSection } from './sections/CardsSection';
import { AvatarsSection } from './sections/AvatarsSection';
import { StatesSection } from './sections/StatesSection';

export const DesignSystemScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 32,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading level="h2">Design System</Heading>
        <Text color="secondary" size="md">
          Catálogo de tokens, componentes tipados e variações de estado do aplicativo.
        </Text>
      </View>

      <ThemeSection />
      <TypographySection />
      <ButtonsSection />
      <InputsSection />
      <BadgesSection />
      <CardsSection />
      <AvatarsSection />
      <StatesSection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    gap: 4,
  },
});
