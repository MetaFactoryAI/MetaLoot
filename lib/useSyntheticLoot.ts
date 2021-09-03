import { useContractLoader, useContractReader } from 'eth-hooks';
import { providers } from 'ethers';
import { useMemo } from 'react';

import LootABI from '@/abis/Loot.json';
import SyntheticLootABI from '@/abis/SyntheticLoot.json';
import { formatAddressSmall } from '@/utils/addressHelpers';

import { LootMetadata } from './types';

const S_LOOT_CONTRACT_ADDRESS = '0x869Ad3Dfb0F9ACB9094BA85228008981BE6DBddE';
const S_LOOT_CONTRACT_NAME = 'SyntheticLoot';
const LOOT_CONTRACT_NAME = 'Loot';
const LOOT_CONTRACT_ADDRESS = '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7';

const SyntheticLootConfig = {
  customAddresses: {
    [S_LOOT_CONTRACT_NAME]: S_LOOT_CONTRACT_ADDRESS,
    [LOOT_CONTRACT_NAME]: LOOT_CONTRACT_ADDRESS,
  },
  externalContracts: {
    1: {
      contracts: {
        [S_LOOT_CONTRACT_NAME]: { abi: SyntheticLootABI },
        [LOOT_CONTRACT_NAME]: { abi: LootABI },
      },
    },
  },
};

const base64Decoder = (val: string) => JSON.parse(atob(val.substring(29)));

export const useSyntheticLoot = (
  provider: providers.Web3Provider | undefined,
  address: string | undefined,
): LootMetadata | undefined => {
  // @ts-expect-error Incorrect types
  const contracts = useContractLoader(provider, SyntheticLootConfig);

  const tokenURI = useContractReader<string>(
    contracts,
    S_LOOT_CONTRACT_NAME,
    'tokenURI',
    [address],
  );

  return useMemo<LootMetadata | undefined>(() => {
    const data: {
      name: string;
      description: string;
      image: string;
    } = tokenURI && base64Decoder(tokenURI);
    if (!data) return undefined;

    return {
      image: data.image,
      name: `Bag ${formatAddressSmall(address)}`,
      description: data.description,
      synthetic: true,
    };
  }, [address, tokenURI]);
};
