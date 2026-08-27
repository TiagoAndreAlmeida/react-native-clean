import { useRepositoryIssues } from '@/presentation/hooks/useIssueRepository';
import { useSelectedRepository } from '@/presentation/providers/SelectedRepositoryProvider';
import { useTheme } from '@/shared/theme';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IssuesScreen } from '../IssuesScreen';

jest.mock('react-native-safe-area-context');
jest.mock('@/presentation/hooks/useIssueRepository');
jest.mock('@/presentation/providers/SelectedRepositoryProvider');

jest.mock('@/shared/theme', () => {
    const actualTheme = jest.requireActual('@/shared/theme');
    return {
        ...actualTheme,
        useTheme: jest.fn(),
    };
});

describe('IssuesScreen', () => {
    const mockUseRepositoryIssues = useRepositoryIssues as jest.Mock;
    const mockUseSelectedRepository = useSelectedRepository as jest.Mock;
    const mockUseTheme = useTheme as jest.Mock;
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

    const actualThemeModule = jest.requireActual('@/shared/theme');
    const realTheme =
        actualThemeModule.theme ||
        actualThemeModule.lightTheme ||
        actualThemeModule.darkTheme;

    const mockFetchNextPage = jest.fn();
    const mockRefetch = jest.fn();

    const dummyRepository = {
        id: '1',
        name: 'react-native',
        fullName: 'facebook/react-native',
    };

    const dummyIssues = [
        {
            id: 'issue-1',
            title: 'Bug na animação de transição de tela',
            createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
            author: {
                name: 'Diego Fernandes',
                avatarUrl: 'https://github.com/diego.png',
            },
            labels: ['bug', 'ui'],
        },
    ];

    const defaultHookReturn = {
        issues: dummyIssues,
        isPending: false,
        isError: false,
        error: null,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
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

        mockUseSelectedRepository.mockReturnValue({
            repository: dummyRepository,
        });

        mockUseRepositoryIssues.mockReturnValue(defaultHookReturn);
    });

    it('deve exibir a mensagem de carregamento quando isPending for true', async () => {
        mockUseRepositoryIssues.mockReturnValue({
            ...defaultHookReturn,
            isPending: true,
            issues: [],
        });

        await render(<IssuesScreen />);

        expect(screen.getByText('Carregando issues...')).toBeTruthy();
    });

    it('deve renderizar a lista de issues com seus detalhes corretamente', async () => {
        await render(<IssuesScreen />);

        expect(screen.getByText('Issues')).toBeTruthy();
        expect(screen.getByText('Bug na animação de transição de tela')).toBeTruthy();
        expect(screen.getByText('Diego Fernandes')).toBeTruthy();
        expect(screen.getByText('bug')).toBeTruthy();
        expect(screen.getByText('ui')).toBeTruthy();
        expect(screen.getByText('facebook/react-native')).toBeTruthy();
        expect(screen.getByText('há 5 min')).toBeTruthy();
    });

    it('deve acionar o callback onGoBack ao clicar no botão "← Voltar"', async () => {
        const onGoBackMock = jest.fn();

        await render(<IssuesScreen onGoBack={onGoBackMock} />);

        const backButton = screen.getByText('← Voltar');
        fireEvent.press(backButton);

        expect(onGoBackMock).toHaveBeenCalledTimes(1);
    });

    it('não deve exibir o botão "← Voltar" quando onGoBack não for passado', async () => {
        await render(<IssuesScreen />);

        expect(screen.queryByText('← Voltar')).toBeNull();
    });

    it('deve exibir o estado vazio quando não houver issues e nenhum erro', async () => {
        mockUseRepositoryIssues.mockReturnValue({
            ...defaultHookReturn,
            issues: [],
        });

        await render(<IssuesScreen />);

        expect(screen.getByText('Nenhuma issue encontrada.')).toBeTruthy();
    });

    it('deve exibir mensagem de erro e permitir refetch ao clicar em "Tentar novamente"', async () => {
        const errorMessage = 'Erro de conexão com o servidor';

        mockUseRepositoryIssues.mockReturnValue({
            ...defaultHookReturn,
            issues: [],
            isError: true,
            error: new Error(errorMessage),
        });

        await render(<IssuesScreen />);

        expect(screen.getByText(errorMessage)).toBeTruthy();

        const retryButton = screen.getByText('Tentar novamente');
        fireEvent.press(retryButton);

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('deve chamar fetchNextPage ao atingir o final da lista quando houver próxima página', async () => {
        mockUseRepositoryIssues.mockReturnValue({
            ...defaultHookReturn,
            hasNextPage: true,
            isFetchingNextPage: false,
        });

        await render(<IssuesScreen />);

        const flatList = screen.getByTestId('issues-list');
        fireEvent(flatList, 'onEndReached');

        expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it('deve exibir o indicador "Carregando mais..." no rodapé da lista durante a busca da próxima página', async () => {
        mockUseRepositoryIssues.mockReturnValue({
            ...defaultHookReturn,
            isFetchingNextPage: true,
        });

        await render(<IssuesScreen />);

        expect(screen.getByText('Carregando mais...')).toBeTruthy();
    });
});