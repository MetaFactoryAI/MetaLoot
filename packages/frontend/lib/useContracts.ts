/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useWallet } from '@meta-cred/usewallet';
import { useContractLoader, useContractReader } from 'eth-hooks';
import { useTokenBalance } from 'eth-hooks/erc/erc-20/useTokenBalance';
import { BaseContract, utils } from 'ethers';
import mapValues from 'lodash/mapValues';
import { MetaLoot, MetaLoot__factory } from 'metaloot-hardhat';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
import { useNft } from 'use-nft';

import AGLD_ABI from '@/abis/AdventureGold.json';
import LootABI from '@/abis/Loot.json';
import SyntheticLootABI from '@/abis/SyntheticLoot.json';
import { NETWORKS, TARGET_NETWORK } from '@/config';
import { LocalProvider } from '@/lib/staticProviders';

import CONTRACT_INFO from '../contracts/contractInfo.json';

enum ContractNames {
  S_LOOT = 'SyntheticLoot',
  LOOT = 'Loot',
  AGLD = 'AdventureGold',
}

const CONTRACT_ADDRESSES = {
  S_LOOT: '0x869Ad3Dfb0F9ACB9094BA85228008981BE6DBddE',
  LOOT: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
  AGLD: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
};

export const DEPLOYED_ADDRESSES = (() => {
  const targetNetworkNames =
    CONTRACT_INFO[`${TARGET_NETWORK.chainId}` as keyof typeof CONTRACT_INFO];

  const config = Object.entries(targetNetworkNames).find(
    ([networkName]) => networkName === TARGET_NETWORK.name,
  )?.[1];

  return mapValues(config?.contracts, (c) => c.address);
})();

const ContractConfig = {
  deployedContracts: CONTRACT_INFO,
  externalContracts: {
    1: {
      contracts: {
        [ContractNames.S_LOOT]: {
          abi: SyntheticLootABI,
          address: CONTRACT_ADDRESSES.S_LOOT,
        },
        [ContractNames.LOOT]: {
          abi: LootABI,
          address: CONTRACT_ADDRESSES.LOOT,
        },
        [ContractNames.AGLD]: {
          abi: AGLD_ABI,
          address: CONTRACT_ADDRESSES.AGLD,
        },
      },
    },
    1337: {
      contracts: {
        [ContractNames.AGLD]: {
          abi: AGLD_ABI,
          address: DEPLOYED_ADDRESSES.SimpleERC20,
        },
      },
    },
  },
};

export const useReadonlyContracts = (chainId = TARGET_NETWORK.chainId) =>
  // @ts-expect-error incorrect types in lib
  useContractLoader(LocalProvider, ContractConfig, chainId);

export const useContracts = (chainId = TARGET_NETWORK.chainId) => {
  const { provider } = useWallet();

  // @ts-expect-error incorrect types in lib
  return useContractLoader(provider, ContractConfig, chainId);
};

export const createContractReader = (
  contractName: ContractNames,
  chainId = TARGET_NETWORK.chainId,
) => <T>(
  functionName: string,
  functionArgs?: unknown[],
  options?: {
    pollTime?: number | undefined;
    formatter?: (_value: T) => T;
    onChange?: (_value?: T | undefined) => void;
  },
) => {
  const contracts = useReadonlyContracts(chainId);

  return useContractReader<T>(
    contracts,
    contractName,
    functionName,
    functionArgs,
    options?.pollTime,
    options?.formatter,
    options?.onChange,
  );
};

export const useSyntheticLootReader = createContractReader(
  ContractNames.S_LOOT,
  NETWORKS.mainnet.chainId,
);

export const useMetaLootData = (tokenId: string) =>
  useNft(DEPLOYED_ADDRESSES.MetaLoot, tokenId);

export const useMetaLootContract = () => {
  const { provider } = useWallet();

  return useMemo(
    () =>
      MetaLoot__factory.connect(
        DEPLOYED_ADDRESSES.MetaLoot,
        provider?.getSigner() || LocalProvider,
      ),
    [provider],
  );
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Fn<T, K extends keyof T> = T[K] extends (...args: any) => any
  ? T[K]
  : never;

type TypedContractReader<TContract extends BaseContract> = <
  Method extends keyof TContract,
  TResult extends UnwrapPromise<ReturnType<Fn<TContract, Method>>>
  >(
  method: Method,
  ...args: Parameters<Fn<TContract, Method>>
) => UseQueryResult<TResult>;

export const useTypedContractReader = <
  TContract extends BaseContract,
  Method extends keyof TContract,
  TResult extends UnwrapPromise<ReturnType<Fn<TContract, Method>>>
>(
  contract: TContract,
  method: Method,
  ...args: Parameters<Fn<TContract, Method>>
) =>
  useQuery(
    [contract.address, method, ...args],
    // @ts-expect-error complains about Parameters not being a tuple but array is fine
    async () => contract[method](...args) as Promise<TResult>,
    { staleTime: 10000 },
  );


export const useMetaLootReader: TypedContractReader<MetaLoot> = (
  method,
  ...args
) => {
  const metaLoot = useMetaLootContract();
  return useTypedContractReader(metaLoot, method, ...args);
};

export const useAgldBalance = (walletAddress?: string) => {
  const { address } = useWallet();
  const contracts = useContracts();

  return +utils.formatEther(
    useTokenBalance(
      contracts[ContractNames.AGLD],
      walletAddress || address || '',
      10000,
    ),
  );
};
