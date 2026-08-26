export interface GitHubPagination {
  hasNextPage: boolean;
}

export function parseGitHubLinkHeader(
  linkHeader?: string,
): GitHubPagination {
  if (!linkHeader) {
    return {
      hasNextPage: false,
    };
  }

  const links = linkHeader.split(',');

  const nextLink = links.find((link) =>
    /rel="next"/.test(link),
  );

  return {
    hasNextPage: Boolean(nextLink),
  };
}