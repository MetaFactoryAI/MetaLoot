import { providers } from 'ethers';

import { NETWORKS, TARGET_NETWORK } from '@/config';

export const LocalProvider = new providers.StaticJsonRpcProvider(
  TARGET_NETWORK.rpcUrl,
);
export const MainnetProvider = new providers.StaticJsonRpcProvider(
  NETWORKS.mainnet.rpcUrl,
);
