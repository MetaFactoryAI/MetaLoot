import { useWallet } from "@meta-cred/usewallet";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { getEthSdk } from "@/eth-sdk";

export function useSwapsBalance(options: { suspense?: boolean } = {}) {
  const { provider, address } = useWallet();
  const sdk = useMemo(() => provider && getEthSdk(provider), [provider]);

  return useQuery(
    `swapBalanceOf-${address}`,
    async () => {
      if (!sdk || !address) return null;
      const balance = await sdk.swaps.balanceOf(address)
      // const balance = await sdk.swaps.(address)

      return balance.toNumber()
    },
    options,
  )
}
