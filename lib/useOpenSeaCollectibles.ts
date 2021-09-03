import { CONFIG } from 'config';
import { OpenSeaAPI } from 'opensea-js';
import { OpenSeaAsset, OpenSeaAssetQuery } from 'opensea-js/lib/types';
import { useEffect, useState } from 'react';

import { useWeb3 } from './hooks';

const opensea = new OpenSeaAPI({ apiKey: CONFIG.openseaApiKey });

export const useHashMasks = (): {
  data: Array<OpenSeaAsset> | null;
  loading: boolean;
} => {
  const { address } = useWeb3();
  const [data, setData] = useState<Array<OpenSeaAsset> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (address) {
        setLoading(true);
        const allData = await fetchHashMasks(address);
        console.log({ allData });

        setData(allData);
        setLoading(false);
      }
    }
    load();
  }, [address]);

  return { data, loading };
};

const fetchHashMasks = async (owner: string): Promise<Array<OpenSeaAsset>> => {
  const query = {
    owner,
    limit: 50,
    asset_contract_address: '0xc2c747e0f7004f9e8817db2ca4997657a7746928',
  };
  // eslint-disable-next-line no-await-in-loop
  return fetchOpenSeaData(query);
};

const fetchOpenSeaData = async (
  query: OpenSeaAssetQuery,
): Promise<Array<OpenSeaAsset>> => {
  const response = await opensea.getAssets(query);
  console.log({ response });

  return response.assets;
};
