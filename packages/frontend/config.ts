interface IConfig {
  appUrl: string;
  networkName: string;
  onboardDappId: string;
  infuraId: string;
  poktId: string;
  shopEndpoint: string;
  shopAccessToken: string;
  shopAdminEndpoint: string;
  shopAdminToken: string;
  openseaApiKey: string;
  openseaUrl: string;
  metalootProductHandle: string;
  metalootVariantId: string;
  itemPrice: number;
  redeemTokenId: string;
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
  appUrl: parseEnv(process.env.NEXT_PUBLIC_VERCEL_URL, 'localhost:3000'),
  redeemTokenId: parseEnv(process.env.NEXT_PUBLIC_REDEEM_TOKEN_ID, '1'),
  networkName: parseEnv(process.env.NEXT_PUBLIC_NETWORK_NAME, 'localhost'),
  shopEndpoint: parseEnv(process.env.NEXT_PUBLIC_SHOP_ENDPOINT, ''),
  shopAccessToken: parseEnv(process.env.NEXT_PUBLIC_SHOP_ACCESS_TOKEN, ''),
  shopAdminEndpoint: parseEnv(process.env.SHOP_ADMIN_ENDPOINT, ''),
  shopAdminToken: parseEnv(process.env.SHOP_ADMIN_TOKEN, ''),
  infuraId: parseEnv(process.env.NEXT_PUBLIC_INFURA_ID),
  poktId: parseEnv(process.env.NEXT_PUBLIC_POKT_ID),
  openseaApiKey: parseEnv(process.env.NEXT_PUBLIC_OPENSEA_API_KEY, ''),
  metalootProductHandle: parseEnv(
    process.env.NEXT_PUBLIC_METALOOT_PRODUCT_HANDLE,
    '',
  ),
  metalootVariantId: parseEnv(process.env.METALOOT_VARIANT_ID, ''),
  itemPrice: parseEnv(process.env.NEXT_PUBLIC_ITEM_PRICE, 420),
  onboardDappId: parseEnv(process.env.NEXT_PUBLIC_ONBOARD_DAPP_ID, ''),
  openseaUrl: parseEnv(process.env.NEXT_PUBLIC_OPENSEA_URL, ''),
};

export const NEXTJS_API_BASE_URL = CONFIG.appUrl.includes('localhost')
  ? `http://${CONFIG.appUrl}`
  : `https://${CONFIG.appUrl}`;

type NetworkConfig = {
  name: NetworkName;
  color: string;
  chainId: number;
  blockExplorer: string;
  rpcUrl: string;
  faucet?: string;
};

export type NetworkName =
  | 'mainnet'
  | 'mainnetFork'
  | 'localhost'
  | 'kovan'
  | 'rinkeby'
  | 'ropsten'
  | 'goerli'
  | 'xdai';

export const NETWORKS: Record<NetworkName, NetworkConfig> = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: 1337,
    blockExplorer: '',
    rpcUrl: 'http://localhost:8545',
  },
  mainnet: {
    name: 'mainnet',
    color: '#ff8b9e',
    chainId: 1,
    blockExplorer: 'https://etherscan.io/',
    rpcUrl: `https://mainnet.infura.io/v3/${CONFIG.infuraId}`,
  },
  mainnetFork: {
    name: 'mainnet',
    color: '#ffc9d1',
    chainId: 1,
    blockExplorer: '',
    rpcUrl: `http://localhost:8545`,
  },
  kovan: {
    name: 'kovan',
    color: '#7003DD',
    chainId: 42,
    blockExplorer: 'https://kovan.etherscan.io/',
    rpcUrl: `https://kovan.infura.io/v3/${CONFIG.infuraId}`,
    faucet: 'https://gitter.im/kovan-testnet/faucet', // https://faucet.kovan.network/
  },
  rinkeby: {
    name: 'rinkeby',
    color: '#e0d068',
    chainId: 4,
    blockExplorer: 'https://rinkeby.etherscan.io/',
    rpcUrl: `https://rinkeby.infura.io/v3/${CONFIG.infuraId}`,
    faucet: 'https://faucet.rinkeby.io/',
  },
  ropsten: {
    name: 'ropsten',
    color: '#F60D09',
    chainId: 3,
    blockExplorer: 'https://ropsten.etherscan.io/',
    rpcUrl: `https://ropsten.infura.io/v3/${CONFIG.infuraId}`,
    faucet: 'https://faucet.ropsten.be/',
  },
  goerli: {
    name: 'goerli',
    color: '#0975F6',
    chainId: 5,
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${CONFIG.infuraId}`,
    faucet: 'https://goerli-faucet.slock.it/',
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: 100,
    blockExplorer: 'https://blockscout.com/xdai/mainnet/',
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
  },
};

export const TARGET_NETWORK =
  NETWORKS[CONFIG.networkName as keyof typeof NETWORKS];
