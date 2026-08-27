import { NetworkError } from '@/domain/errors/NetworkError';
import { RateLimitError } from '@/domain/errors/RateLimitError';
import Toast from 'react-native-toast-message';

export interface DisplayableError {
    title: string;
    message: string;
}

export function getErrorMessage(error: unknown): DisplayableError {
    if (error instanceof RateLimitError) {
        return {
            title: '⏳ Limite excedido',
            message: error.message || 'Atingido o limite da API. Aguarde alguns minutos.',
        };
    }

    if (error instanceof NetworkError) {
        return {
            title: '📡 Sem conexão',
            message: error.message || 'Verifique sua conexão com a internet.',
        };
    }

    return {
        title: '⚠️ Erro inesperado',
        message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
    };
}

export function showErrorToast(error: unknown, bottomOffset?: number): void {
    const { title, message } = getErrorMessage(error);

    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        position: 'bottom',
        visibilityTime: 4000,
        bottomOffset,
    });
}