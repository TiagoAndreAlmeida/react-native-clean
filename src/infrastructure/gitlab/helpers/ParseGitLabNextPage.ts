export function hasGitLabNextPage(nextPageValue: unknown): boolean {
  if (nextPageValue === undefined || nextPageValue === null || nextPageValue === '') {
    return false;
  }

  const nextPageNumber = Number(nextPageValue);

  return !Number.isNaN(nextPageNumber) && Number.isInteger(nextPageNumber) && nextPageNumber > 0;
}