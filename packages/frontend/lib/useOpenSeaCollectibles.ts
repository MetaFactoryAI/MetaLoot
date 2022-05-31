import { OpenSeaAPI } from 'opensea-js';
import { OpenSeaAsset, OpenSeaAssetQuery } from 'opensea-js/lib/types';
import { useQuery } from 'react-query';

import { CONFIG } from '@/config';

import { LootMetadata } from './types';

const opensea = new OpenSeaAPI({ apiKey: CONFIG.openseaApiKey });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSwaps = (address: string | null) =>
  useQuery(
    ['openseaSwaps', address],
    async () => {
      if (!address) return null;

      return fetchSwaps(address);
    },
    { enabled: Boolean(address) },
  );

export const fetchSwaps = async (owner: string): Promise<Array<LootMetadata>> => {
  const query = {
    owner,
    limit: 50,
    asset_contract_address: '0xcd327d27f64b9bd998c7fde6bf279ad542750826',
  };
  const data = await fetchOpenSeaData(query);

  return data.map((d) => ({
    image: d.imageUrl.replace('=s250', '=s420'),
    name: d.name,
    description: d.description,
    tokenId: d.tokenId,
  }));
};

export const fetchOwnerOfSwap = async (tokenId: string): Promise<string | null> => {
  const query = {
    token_ids: [tokenId],
    limit: 1,
    asset_contract_address: '0xcd327d27f64b9bd998c7fde6bf279ad542750826',
  };
  const data = await fetchOpenSeaData(query);

  return data[0]?.owner.address
};

const fetchOpenSeaData = async (
  query: OpenSeaAssetQuery,
): Promise<Array<OpenSeaAsset>> => {
  const response = await opensea.getAssets(query);

  return response.assets;
};
