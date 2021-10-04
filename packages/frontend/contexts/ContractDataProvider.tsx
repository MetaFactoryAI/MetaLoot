import { useWallet } from '@meta-cred/usewallet';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { NftProvider } from 'use-nft';

import { LocalProvider } from '@/lib/staticProviders';
import { ipfsUrl } from '@/lib/stringHelpers';

const fetcherConfig = { provider: LocalProvider };

export const ContractDataProvider: React.FC = ({ children }) => {
  const { connectedNetworkId } = useWallet();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries();
    console.log('NetworkChanged', connectedNetworkId);
  }, [queryClient, connectedNetworkId]);

  return (
    <NftProvider ipfsUrl={ipfsUrl} fetcher={['ethers', fetcherConfig]}>
      {children}
    </NftProvider>
  );
};
