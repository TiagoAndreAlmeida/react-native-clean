import { parseGitHubLinkHeader } from "../ParseGitHubLinkHeader";

describe('parseGitHubLinkHeader', () => {
  it('deve detectar a existência de uma próxima página', () => {
    const result = parseGitHubLinkHeader(
      '<https://api.github.com/test?page=2>; rel="next", <https://api.github.com/test?page=1>; rel="prev"',
    );

    expect(result.hasNextPage).toBe(true);
  });

  it('deve retornar false quando a próxima página não existir', () => {
    const result = parseGitHubLinkHeader(
      '<https://api.github.com/test?page=1>; rel="prev"',
    );

    expect(result.hasNextPage).toBe(false);
  });

  it('deve retornar false quando o cabeçalho de link estiver ausente', () => {
    const result =
      parseGitHubLinkHeader(undefined);

    expect(result.hasNextPage).toBe(false);
  });
});