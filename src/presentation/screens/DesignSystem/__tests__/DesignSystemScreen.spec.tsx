import { useTheme } from '@/shared/theme';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DesignSystemScreen } from '../DesignSystemScreen';

jest.mock('react-native-safe-area-context');

jest.mock('@/shared/theme', () => {
    const actualTheme = jest.requireActual('@/shared/theme');
    return {
        ...actualTheme,
        useTheme: jest.fn(),
    };
});

// Mock das seções para isolar o teste unitário da tela
jest.mock('../sections/ThemeSection', () => ({
    ThemeSection: () => null,
}));
jest.mock('../sections/TypographySection', () => ({
    TypographySection: () => null,
}));
jest.mock('../sections/ButtonsSection', () => ({
    ButtonsSection: () => null,
}));
jest.mock('../sections/InputsSection', () => ({
    InputsSection: () => null,
}));
jest.mock('../sections/BadgesSection', () => ({
    BadgesSection: () => null,
}));
jest.mock('../sections/CardsSection', () => ({
    CardsSection: () => null,
}));
jest.mock('../sections/AvatarsSection', () => ({
    AvatarsSection: () => null,
}));
jest.mock('../sections/StatesSection', () => ({
    StatesSection: () => null,
}));

describe('DesignSystemScreen', () => {
    const mockUseTheme = useTheme as jest.Mock;
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

    const actualThemeModule = jest.requireActual('@/shared/theme');
    const realTheme =
        actualThemeModule.theme ||
        actualThemeModule.lightTheme ||
        actualThemeModule.darkTheme;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseSafeAreaInsets.mockReturnValue({
            top: 16,
            bottom: 16,
            left: 0,
            right: 0,
        });

        mockUseTheme.mockReturnValue({
            theme: realTheme,
            isDark: false,
        });
    });

    it('deve renderizar o cabeçalho e a descrição do Design System corretamente', async () => {
        await render(<DesignSystemScreen />);

        expect(screen.getByText('Design System')).toBeTruthy();
        expect(
            screen.getByText(
                'Catálogo de tokens, componentes tipados e variações de estado do aplicativo.'
            )
        ).toBeTruthy();
    });
});