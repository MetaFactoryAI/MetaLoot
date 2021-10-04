/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useWallet } from '@meta-cred/usewallet';
import { useContractLoader, useContractReader } from 'eth-hooks';
import { TEthersProviderOrSigner } from 'eth-hooks/models';
import { BaseContract, utils } from 'ethers';
import mapValues from 'lodash/mapValues';
import {
  MetaLoot,
  MetaLoot__factory,
  SimpleERC20__factory,
} from 'metaloot-hardhat';
import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
import { useNft } from 'use-nft';

import LootABI from '@/abis/Loot.json';
import SyntheticLootABI from '@/abis/SyntheticLoot.json';
import { NETWORKS, TARGET_NETWORK } from '@/config';
import { LocalProvider, MainnetProvider } from '@/lib/staticProviders';

import CONTRACT_INFO from '../contracts/contractInfo.json';

enum ContractNames {
  S_LOOT = 'SyntheticLoot',
  LOOT = 'Loot',
  AGLD = 'AdventureGold',
}

const MAINNET_CONTRACT_ADDRESSES = {
  S_LOOT: '0x869Ad3Dfb0F9ACB9094BA85228008981BE6DBddE',
  LOOT: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
  AGLD: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
};

const CUSTOM_ADDRESSES: Record<number, Record<string, string>> = {
  [NETWORKS.mainnet.chainId]: {
    SimpleERC20: MAINNET_CONTRACT_ADDRESSES.AGLD,
  },
};

export const CONTRACT_ADDRESSES = (() => {
  const targetNetworkNames =
    CONTRACT_INFO[`${TARGET_NETWORK.chainId}` as keyof typeof CONTRACT_INFO];

  const config = Object.entries(targetNetworkNames).find(
    ([networkName]) => networkName === TARGET_NETWORK.name,
  )?.[1];

  const customAddresses = CUSTOM_ADDRESSES[TARGET_NETWORK.chainId];

  return mapValues(
    config?.contracts,
    (c, name) => customAddresses?.[name] || c.address,
  );
})();

const ContractConfig = {
  deployedContracts: CONTRACT_INFO,
  externalContracts: {
    [NETWORKS.mainnet.chainId]: {
      contracts: {
        [ContractNames.S_LOOT]: {
          abi: SyntheticLootABI,
          address: MAINNET_CONTRACT_ADDRESSES.S_LOOT,
        },
        [ContractNames.LOOT]: {
          abi: LootABI,
          address: MAINNET_CONTRACT_ADDRESSES.LOOT,
        },
      },
    },
  },
};

export const useContracts = (
  chainId = TARGET_NETWORK.chainId,
  customProvider?: TEthersProviderOrSigner,
) => {
  const { provider } = useWallet();

  // @ts-expect-error incorrect types in lib
  return useContractLoader(customProvider || provider, ContractConfig, chainId);
};

export const createContractReader = (
  contractName: ContractNames,
  chainId = TARGET_NETWORK.chainId,
  customProvider?: TEthersProviderOrSigner,
) => <T>(
  functionName: string,
  functionArgs?: unknown[],
  options?: {
    pollTime?: number | undefined;
    formatter?: (_value: T) => T;
    onChange?: (_value?: T | undefined) => void;
  },
) => {
  const contracts = useContracts(chainId, customProvider);

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
  MainnetProvider,
);

export const useMetaLootData = (tokenId: string) =>
  useNft(CONTRACT_ADDRESSES.MetaLoot, tokenId);

export const useMetaLootContract = () => {
  const { provider, connectedNetworkId } = useWallet();

  return useMemo(
    () =>
      MetaLoot__factory.connect(
        CONTRACT_ADDRESSES.MetaLoot,
        provider?.getSigner() || LocalProvider,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, connectedNetworkId],
  );
};

export const useAGLDContract = () => {
  const { provider, connectedNetworkId } = useWallet();

  return useMemo(
    () =>
      SimpleERC20__factory.connect(
        CONTRACT_ADDRESSES.SimpleERC20,
        provider?.getSigner() || LocalProvider,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, connectedNetworkId],
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
) => (options?: UseQueryOptions<TResult>) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useQuery(
    [contract.address, method, ...args],
    // @ts-expect-error complains about Parameters not being a tuple but array is fine
    async () => contract[method](...args) as Promise<TResult>,
    options,
  );

export const useMetaLootReader: TypedContractReader<MetaLoot> = (
  method,
  ...args
) => {
  const metaLoot = useMetaLootContract();
  return useTypedContractReader(metaLoot, method, ...args)();
};

export const useAgldBalance = (walletAddress?: string) => {
  const { address } = useWallet();
  const agld = useAGLDContract();
  const readBalance = useTypedContractReader(
    agld,
    'balanceOf',
    walletAddress || address || '',
  )({ enabled: Boolean(walletAddress || address), refetchInterval: 5000 });
  if (!readBalance.data) return 0;

  return +utils.formatEther(readBalance.data);
};
