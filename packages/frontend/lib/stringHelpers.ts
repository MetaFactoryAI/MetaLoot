export const maybePluralize = (
  count: number,
  noun: string,
  suffix = 's',
): string => `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const ipfsUrl = (cid: string, path = ""): string => `https://gateway.pinata.cloud/ipfs/${cid}${path}`
