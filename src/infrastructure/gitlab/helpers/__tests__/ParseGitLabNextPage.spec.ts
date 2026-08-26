import { hasGitLabNextPage } from '../ParseGitLabNextPage';

describe('hasGitLabNextPage', () => {
  it('deve retornar true quando o valor for uma string com número válido', () => {
    expect(hasGitLabNextPage('2')).toBe(true);
  });

  it('deve retornar true quando o valor for um número válido', () => {
    expect(hasGitLabNextPage(2)).toBe(true);
  });

  it('deve retornar false quando o valor for string vazia, null ou undefined', () => {
    expect(hasGitLabNextPage('')).toBe(false);
    expect(hasGitLabNextPage(null)).toBe(false);
    expect(hasGitLabNextPage(undefined)).toBe(false);
  });

  it('deve retornar false quando o valor for menor ou igual a zero', () => {
    expect(hasGitLabNextPage('0')).toBe(false);
    expect(hasGitLabNextPage(0)).toBe(false);
    expect(hasGitLabNextPage('-1')).toBe(false);
  });

  it('deve retornar false quando o valor não puder ser convertido para número (NaN)', () => {
    expect(hasGitLabNextPage('invalid-number')).toBe(false);
  });
});