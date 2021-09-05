/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContractLoader, useContractReader } from 'eth-hooks';
import { useTokenBalance } from 'eth-hooks/erc/erc-20/useTokenBalance';
import { providers, utils } from 'ethers';

import AGLD_ABI from '@/abis/AdventureGold.json';
import LootABI from '@/abis/Loot.json';
import SyntheticLootABI from '@/abis/SyntheticLoot.json';
import { useWeb3 } from '@/lib/useWeb3';

const CONTRACT_NAMES = {
  S_LOOT: 'SyntheticLoot',
  LOOT: 'Loot',
  AGLD: 'AdventureGold',
};

const CONTRACT_ADDRESSES = {
  S_LOOT: '0x869Ad3Dfb0F9ACB9094BA85228008981BE6DBddE',
  LOOT: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
  AGLD: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
};

const SyntheticLootConfig = {
  customAddresses: {
    [CONTRACT_NAMES.S_LOOT]: CONTRACT_ADDRESSES.S_LOOT,
    [CONTRACT_NAMES.LOOT]: CONTRACT_ADDRESSES.LOOT,
    [CONTRACT_NAMES.AGLD]: CONTRACT_ADDRESSES.AGLD,
  },
  externalContracts: {
    1: {
      contracts: {
        [CONTRACT_NAMES.S_LOOT]: { abi: SyntheticLootABI },
        [CONTRACT_NAMES.LOOT]: { abi: LootABI },
        [CONTRACT_NAMES.AGLD]: { abi: AGLD_ABI },
      },
    },
  },
};

export const useContracts = (provider: providers.Web3Provider | undefined) =>
  // @ts-expect-error Incorrect types
  useContractLoader(provider, SyntheticLootConfig, 1);

export const useSyntheticLootContract = <T>(
  functionName: string,
  functionArgs: unknown[],
) => {
  const { provider } = useWeb3();
  const contracts = useContracts(provider);

  return useContractReader<T>(
    contracts,
    CONTRACT_NAMES.S_LOOT,
    functionName,
    functionArgs,
  );
};

export const useAgldBalance = (walletAddress?: string) => {
  const { provider, address } = useWeb3();

  const contracts = useContracts(provider);

  return +utils.formatEther(
    useTokenBalance(
      contracts[CONTRACT_NAMES.AGLD],
      walletAddress || address || '',
    ),
  );
};
