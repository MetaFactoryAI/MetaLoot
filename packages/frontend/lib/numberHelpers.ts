import { BigNumber as BN, utils } from 'ethers';

export function truncateNumber(amount: BN, decimals = 0): string {
  return (+utils.formatEther(amount)).toFixed(decimals);
}

export function formatNumberWithLength(
  amount: string | number,
  maxDecimals = 3,
): number {
  const val = +amount;
  if (val > 10 ** maxDecimals) {
    return Number(val.toFixed(0));
  }

  return Number(val.toFixed(maxDecimals));
}
