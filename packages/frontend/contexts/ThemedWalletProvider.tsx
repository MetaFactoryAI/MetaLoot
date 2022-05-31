import { useColorModeValue } from '@chakra-ui/react';
import { WalletProvider } from '@meta-cred/usewallet';
import React, { FC, useMemo } from 'react';
import { configureChains, createClient, defaultChains, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { CONFIG, TARGET_NETWORK } from '@/config';
import { ContractDataProvider } from '@/contexts/ContractDataProvider';

const APP_NAME = 'Swaps';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ infuraId: CONFIG.infuraId }),
  publicProvider(),
])

// Set up client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'MetaFactory',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

export const ThemedWalletProvider: FC = ({ children }) => {
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
      appName={APP_NAME}
      customOptions={{
        networkId: TARGET_NETWORK.chainId,
        networkName: TARGET_NETWORK.name,
        walletSelect: {
          wallets,
          description: '',
        },
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <ContractDataProvider>{children}</ContractDataProvider>
      </WagmiConfig>
    </WalletProvider>
  );
};
