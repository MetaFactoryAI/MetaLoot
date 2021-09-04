interface IConfig {
  graphqlURL: string;
  infuraId: string;
  openseaApiKey: string;
  itemPrice: number;
}

function parseEnv<T extends string | number>(
  v: string | undefined,
  defaultValue?: T,
): T {
  if (v) {
    return typeof defaultValue === 'number' ? (Number(v) as T) : (v as T);
  }

  if (defaultValue == null) throw new Error('Missing ENV Variable');

  return defaultValue;
}

export const CONFIG: IConfig = {
  graphqlURL: parseEnv(
    process.env.NEXT_PUBLIC_GRAPHQL_URL,
    'http://localhost:8080/v1/graphql',
  ),
  infuraId: parseEnv(
    process.env.NEXT_PUBLIC_INFURA_ID,
    '781d8466252d47508e177b8637b1c2fd',
  ),
  openseaApiKey: parseEnv(process.env.NEXT_PUBLIC_OPENSEA_API_KEY, ''),
  itemPrice: parseEnv(process.env.NEXT_PUBLIC_ITEM_PRICE, 150),
};
