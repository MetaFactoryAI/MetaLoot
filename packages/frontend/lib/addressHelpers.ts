export const formatAddress = (address = ''): string =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const formatAddressSmall = (address = ''): string =>
  `${address.slice(0, 6)}`;
