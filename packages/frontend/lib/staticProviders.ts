import { providers } from 'ethers';

import { TARGET_NETWORK } from '@/config';

export const LocalProvider = new providers.StaticJsonRpcProvider(TARGET_NETWORK.rpcUrl);
