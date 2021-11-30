import { getDefaultProvider, providers } from 'ethers';

import { CONFIG, NETWORKS, TARGET_NETWORK } from '@/config';

export const LocalProvider = getDefaultProvider(TARGET_NETWORK.rpcUrl, {
  infura: CONFIG.infuraId,
});

export const MainnetProvider = new providers.StaticJsonRpcProvider(
  NETWORKS.mainnet.rpcUrl,
);
