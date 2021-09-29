interface IConfig {
  networkName: string;
  graphqlURL: string;
  onboardDappId: string;
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
  networkName: parseEnv(process.env.NEXT_PUBLIC_NETWORK_NAME, 'localhost'),
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
  onboardDappId: parseEnv(process.env.NEXT_PUBLIC_ONBOARD_DAPP_ID, ''),
};

type NetworkConfig = {
  name: NetworkName;
  color: string;
  chainId: number;
  blockExplorer: string;
  rpcUrl: string;
  faucet?: string;
};

type NetworkName =
  | 'mainnet'
  | 'localhost'
  | 'kovan'
  | 'rinkeby'
  | 'ropsten'
  | 'goerli';

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
};

export const TARGET_NETWORK =
  NETWORKS[CONFIG.networkName as keyof typeof NETWORKS];
