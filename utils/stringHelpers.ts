export const maybePluralize = (
  count: number,
  noun: string,
  suffix = 's',
): string => `${count} ${noun}${count !== 1 ? suffix : ''}`;
