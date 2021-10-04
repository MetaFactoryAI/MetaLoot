import { useColorModeValue } from '@chakra-ui/react';
import { WalletProvider } from '@meta-cred/usewallet';
import React, { useMemo } from 'react';

import { CONFIG, TARGET_NETWORK } from '@/config';
import { ContractDataProvider } from '@/contexts/ContractDataProvider';

const APP_NAME = 'MetaLoot';

export const ThemedWalletProvider: React.FC = ({ children }) => {
  const isDark = useColorModeValue(false, true);

  const wallets = useMemo(
    () => [
      { walletName: 'metamask', preferred: true },
      {
        walletName: 'walletConnect',
        preferred: true,
        infuraKey: CONFIG.infuraId,
      },
      {
        walletName: 'walletLink',
        rpcUrl: TARGET_NETWORK.rpcUrl,
      },
      {
        walletName: 'lattice',
        rpcUrl: TARGET_NETWORK.rpcUrl,
        appName: APP_NAME,
      },
      { walletName: 'torus', appName: APP_NAME, infuraKey: CONFIG.infuraId },
      { walletName: 'status' },
    ],
    [],
  );

  return (
    <WalletProvider
      networkId={TARGET_NETWORK.chainId}
      onboardDappId={CONFIG.onboardDappId}
      infuraKey={CONFIG.infuraId}
      rpcUrl={TARGET_NETWORK.rpcUrl}
      darkMode={isDark}
      appName="MetaLoot"
      customOptions={{
        networkId: TARGET_NETWORK.chainId,
        networkName: TARGET_NETWORK.name,
        walletSelect: {
          wallets,
          description: '',
        },
      }}
    >
      <ContractDataProvider>{children}</ContractDataProvider>
    </WalletProvider>
  );
};
