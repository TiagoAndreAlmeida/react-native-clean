import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Card, Input } from '@/presentation/components';

export const InputsSection: React.FC = () => {
  const [searchValue, setSearchValue] = useState('react native');
  const [emptyValue, setEmptyValue] = useState('');

  return (
    <Card variant="outlined" padding="md" style={styles.container}>
      <Heading level="h4" style={styles.title}>
        📝 Campos de Entrada (Inputs)
      </Heading>

      <View style={styles.group}>
        <Input
          label="Busca de repositórios"
          placeholder="Ex: typescript, react..."
          value={searchValue}
          onChangeText={setSearchValue}
          onClear={() => setSearchValue('')}
          helperText="Digite para filtrar projetos"
        />

        <Input
          label="Campo com erro de validação"
          placeholder="Digite o nome..."
          value={emptyValue}
          onChangeText={setEmptyValue}
          error="Este campo é obrigatório"
        />

        <Input
          label="Campo Desabilitado"
          value="Valor fixo não editável"
          disabled
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
  group: {
    gap: 16,
  },
});
