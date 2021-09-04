export type Collectible = {
  address: string;
  tokenId: string;
  title: string;
  imageUrl: string;
  openseaLink: string;
  priceString: string;
};

export type LootMetadata = {
  id: string;
  name: string;
  description: string;
  image: string;
  synthetic: boolean;
};

export type CheckoutLineItem = {
  variantId: string;
  lootId: string;
};
