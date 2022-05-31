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
  image: string;
  description: string;
  tokenId: string | null;
};

export type CheckoutData = {
  id: string | undefined;
  url: string | undefined;
};

export type CheckoutLineItem = {
  variantId: string;
  lootId: string;
};

export enum ApparelSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = '2XL',
  XXXL = '3XL',
}

export enum GloveSize {
  SM = 'S/M',
  LXL = 'L/XL',
}

export type CheckoutOptions = {
  selectedBag: LootMetadata;
  ethAddress: string;
};
