import { useColorModeValue } from '@chakra-ui/react';
import { WalletProvider } from '@meta-cred/usewallet';
import React from 'react';
import { NftProvider } from 'use-nft';

import { CONFIG, TARGET_NETWORK } from '@/config';
import { LocalProvider } from '@/lib/staticProviders';
import { ipfsUrl } from '@/lib/stringHelpers';

export const ThemedWalletProvider: React.FC = ({ children }) => {
  const isDark = useColorModeValue(false, true);

  return (
    <WalletProvider
      networkId={TARGET_NETWORK.chainId}
      onboardDappId={CONFIG.onboardDappId}
      infuraKey={CONFIG.infuraId}
      rpcUrl={TARGET_NETWORK.rpcUrl}
      darkMode={isDark}
      appName="MetaLoot"
    >
      <NftProvider
        ipfsUrl={ipfsUrl}
        fetcher={['ethers', { provider: LocalProvider }]}
      >
        {children}
      </NftProvider>
    </WalletProvider>
  );
};
