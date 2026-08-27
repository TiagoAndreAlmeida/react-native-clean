import { useSearchRepositories } from '@/presentation/hooks/useSearchRepositories';
import { useDataSource } from '@/presentation/providers/DataSourceProvider';
import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';
import { showErrorToast } from '@/presentation/utils/showErrorToast';
import { useTheme } from '@/shared/theme';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchScreen } from '../SearchScreen';

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
    },
}));

jest.mock('react-native-safe-area-context');
jest.mock('@/presentation/hooks/useSearchRepositories');
jest.mock('@/presentation/providers/DataSourceProvider');
jest.mock('@/presentation/providers/SelectedRepositoryProvider');
jest.mock('@/presentation/utils/showErrorToast');

jest.mock('@/shared/theme', () => {
    const actualTheme = jest.requireActual('@/shared/theme');
    return {
        ...actualTheme,
        useTheme: jest.fn(),
    };
});

describe('SearchScreen', () => {
    const mockUseSearchRepositories = useSearchRepositories as jest.Mock;
    const mockUseDataSource = useDataSource as jest.Mock;
    const mockUseSelectedRepository = useSelectedRepository as jest.Mock;
    const mockShowErrorToast = showErrorToast as jest.Mock;
    const mockUseTheme = useTheme as jest.Mock;
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

    const actualThemeModule = jest.requireActual('@/shared/theme');
    const realTheme =
        actualThemeModule.theme ||
        actualThemeModule.lightTheme ||
        actualThemeModule.darkTheme;

    const mockSetDataSource = jest.fn();
    const mockSetRepository = jest.fn();
    const mockFetchNextPage = jest.fn();
    const mockRefetch = jest.fn();

    const dummyRepositories = [
        {
            id: 'facebook/react-native',
            fullName: 'facebook/react-native',
            description: 'A framework for building native applications using React',
            stars: 110000,
            forks: 23000,
            watchers: 3800,
            language: 'TypeScript',
            owner: {
                name: 'facebook',
                avatarUrl: 'https://github.com/facebook.png',
            },
        },
    ];

    const defaultHookReturn = {
        repositories: dummyRepositories,
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: mockRefetch,
        isRefetching: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseSafeAreaInsets.mockReturnValue({ top: 16, bottom: 16, left: 0, right: 0 });

        mockUseTheme.mockReturnValue({
            theme: realTheme,
            isDark: false,
        });

        mockUseDataSource.mockReturnValue({
            dataSource: 'github',
            setDataSource: mockSetDataSource,
        });

        mockUseSelectedRepository.mockReturnValue({
            setRepository: mockSetRepository,
        });

        mockUseSearchRepositories.mockReturnValue(defaultHookReturn);
    });

    it('deve renderizar o cabeçalho e a lista de repositórios corretamente', async () => {
        await render(<SearchScreen />);

        expect(screen.getByText('Repositórios')).toBeTruthy();
        expect(screen.getByText('🐙 GitHub')).toBeTruthy();
        expect(screen.getByText('facebook/react-native')).toBeTruthy();
        expect(screen.getByText('TypeScript')).toBeTruthy();
        expect(screen.getByText('★ 110000')).toBeTruthy();
    });

    it('deve alternar o provedor de dados ao clicar no badge do header', async () => {
        await render(<SearchScreen />);

        const providerBadge = screen.getByText('🐙 GitHub');
        fireEvent.press(providerBadge);

        expect(mockSetDataSource).toHaveBeenCalledWith('gitlab');
    });

    it('deve selecionar o repositório e navegar para a tela de detalhes ao clicar no card', async () => {
        await render(<SearchScreen />);

        const repoCard = screen.getByText('facebook/react-native');
        fireEvent.press(repoCard);

        expect(mockSetRepository).toHaveBeenCalledWith(dummyRepositories[0]);
        expect(router.push).toHaveBeenCalledWith(
            `/repository/${encodeURIComponent('facebook/react-native')}`
        );
    });

    it('deve disparar o showErrorToast quando o hook retornar estado de erro', async () => {
        const mockError = new Error('Falha na requisição');

        mockUseSearchRepositories.mockReturnValue({
            ...defaultHookReturn,
            isError: true,
            error: mockError,
        });

        await render(<SearchScreen />);

        expect(mockShowErrorToast).toHaveBeenCalledWith(mockError, expect.any(Number));
    });

    it('deve exibir mensagem de nenhum repositório encontrado quando a lista for vazia', async () => {
        mockUseSearchRepositories.mockReturnValue({
            ...defaultHookReturn,
            repositories: [],
        });

        await render(<SearchScreen />);

        expect(screen.getByText('Nenhum repositório encontrado.')).toBeTruthy();
    });

    it('deve exibir mensagem de erro na lista quando isError for true e sem resultados', async () => {
        mockUseSearchRepositories.mockReturnValue({
            ...defaultHookReturn,
            repositories: [],
            isError: true,
            error: new Error('Erro'),
        });

        await render(<SearchScreen />);

        expect(screen.getByText('Não foi possível carregar os repositórios.')).toBeTruthy();
    });

    it('deve chamar fetchNextPage ao atingir o final da lista se houver próxima página', async () => {
        mockUseSearchRepositories.mockReturnValue({
            ...defaultHookReturn,
            hasNextPage: true,
            isFetchingNextPage: false,
        });

        await render(<SearchScreen />);

        const flatList = screen.getByTestId('repository-list');
        fireEvent(flatList, 'onEndReached');

        expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
});