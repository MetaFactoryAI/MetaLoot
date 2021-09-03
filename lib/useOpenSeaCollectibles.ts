import { OpenSeaAPI } from 'opensea-js';
import { OpenSeaAsset, OpenSeaAssetQuery } from 'opensea-js/lib/types';
import { useQuery } from 'react-query';

import { CONFIG } from '@/config';

import { useWeb3 } from './hooks';
import { LootMetadata } from './types';

const opensea = new OpenSeaAPI({ apiKey: CONFIG.openseaApiKey });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLoot = () => {
  const { address } = useWeb3();

  return useQuery(
    ['openseaLoot', address],
    async () => {
      if (!address) return null;

      return fetchLoot(address);
    },
    { enabled: Boolean(address) },
  );
};

const fetchLoot = async (owner: string): Promise<Array<LootMetadata>> => {
  const query = {
    owner,
    limit: 50,
    asset_contract_address: '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7',
  };
  const data = await fetchOpenSeaData(query);

  return data.map((d) => ({
    image: d.imageUrl,
    name: d.name,
    description: d.description,
    synthetic: false,
  }));
};

const fetchOpenSeaData = async (
  query: OpenSeaAssetQuery,
): Promise<Array<OpenSeaAsset>> => {
  const response = await opensea.getAssets(query);

  return response.assets;
};
