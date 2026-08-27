import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';
import { useTheme } from '@/shared/theme';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RepositoryDetailsScreen } from '../RepositoryDetailsScreen';

jest.mock('@/presentation/providers/SelectedRepositoryProvider');
jest.mock('react-native-safe-area-context');

// Preserva o tema real do projeto e mocka apenas a chamada da função useTheme
jest.mock('@/shared/theme', () => {
    const actualTheme = jest.requireActual('@/shared/theme');
    return {
        ...actualTheme,
        useTheme: jest.fn(),
    };
});

describe('RepositoryDetailsScreen', () => {
    const mockUseSelectedRepository = useSelectedRepository as jest.Mock;
    const mockUseTheme = useTheme as jest.Mock;
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

    // Carrega as propriedades reais exportadas pelo módulo de tema
    const actualThemeModule = jest.requireActual('@/shared/theme');
    const realTheme =
        actualThemeModule.theme ||
        actualThemeModule.lightTheme ||
        actualThemeModule.darkTheme;

    const dummyRepository = {
        id: '1',
        name: 'react-native',
        fullName: 'facebook/react-native',
        description: 'A framework for building native apps using React',
        stars: 110000,
        forks: 23000,
        watchers: 3800,
        language: 'TypeScript',
        owner: {
            name: 'facebook',
            avatarUrl: 'https://github.com/facebook.png',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseSafeAreaInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });

        // Injeta o tema completo e real no mock
        mockUseTheme.mockReturnValue({
            theme: realTheme,
            isDark: false,
        });

        mockUseSelectedRepository.mockReturnValue({
            repository: dummyRepository,
        });
    });

    it('deve renderizar os detalhes do repositório corretamente', async () => {
        await render(
            <RepositoryDetailsScreen onNavigateToIssues={jest.fn()} />
        );

        expect(screen.getByText('react-native')).toBeTruthy();
        expect(screen.getByText('TypeScript')).toBeTruthy();
        expect(screen.getByText('★ 110000')).toBeTruthy();
        expect(screen.getByText('⑂ 23000')).toBeTruthy();
        expect(screen.getByText('👁 3800')).toBeTruthy();
        expect(
            screen.getByText('A framework for building native apps using React')
        ).toBeTruthy();
    });

    it('deve exibir o nome do proprietário do repositório', async () => {
        await render(
            <RepositoryDetailsScreen onNavigateToIssues={jest.fn()} />
        );

        expect(screen.getByText('facebook/react-native')).toBeTruthy();
    });

    it('deve exibir textos de fallback quando linguagem e descrição não existirem', async () => {
        mockUseSelectedRepository.mockReturnValue({
            repository: {
                ...dummyRepository,
                language: null,
                description: null,
            },
        });

        await render(
            <RepositoryDetailsScreen onNavigateToIssues={jest.fn()} />
        );

        expect(screen.getByText('N/A')).toBeTruthy();
        expect(screen.getByText('Sem descrição disponível.')).toBeTruthy();
    });

    it('deve chamar onNavigateToIssues ao clicar no botão "Ver Issues"', async () => {
        const onNavigateToIssuesMock = jest.fn();

        await render(
            <RepositoryDetailsScreen onNavigateToIssues={onNavigateToIssuesMock} />
        );

        fireEvent.press(screen.getByText('Ver Issues'));

        expect(onNavigateToIssuesMock).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar o botão "← Voltar" e chamar onGoBack quando fornecido', async () => {
        const onGoBackMock = jest.fn();

        await render(
            <RepositoryDetailsScreen
                onNavigateToIssues={jest.fn()}
                onGoBack={onGoBackMock}
            />
        );

        const backButton = screen.getByText('← Voltar');
        expect(backButton).toBeTruthy();

        fireEvent.press(backButton);
        expect(onGoBackMock).toHaveBeenCalledTimes(1);
    });

    it('não deve renderizar o botão "← Voltar" quando onGoBack não for informado', async () => {
        await render(
            <RepositoryDetailsScreen onNavigateToIssues={jest.fn()} />
        );

        expect(screen.queryByText('← Voltar')).toBeNull();
    });
});