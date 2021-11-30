import { useMemo } from 'react';

import { formatAddress } from '@/lib/addressHelpers';
import { useSyntheticLootReader } from '@/lib/useContracts';

import { LootMetadata } from './types';

const base64Decoder = (val: string) => JSON.parse(atob(val.substring(29)));

export const useSyntheticLoot = (
  address: string | null | undefined,
): LootMetadata | undefined => {
  const tokenURI = useSyntheticLootReader<string>('tokenURI', [address]);

  return useMemo<LootMetadata | undefined>(() => {
    const data: {
      name: string;
      description: string;
      image: string;
    } = tokenURI && base64Decoder(tokenURI);

    if (!data || !address) return undefined;

    return {
      id: address,
      image: data.image,
      name: `Bag ${formatAddress(address || undefined)}`,
      synthetic: true,
    };
  }, [address, tokenURI]);
};
