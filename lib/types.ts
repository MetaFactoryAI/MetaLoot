export type Collectible = {
  address: string;
  tokenId: string;
  title: string;
  imageUrl: string;
  openseaLink: string;
  priceString: string;
};

export type LootMetadata = {
  name: string;
  description: string;
  image: string;
  synthetic: boolean;
};
