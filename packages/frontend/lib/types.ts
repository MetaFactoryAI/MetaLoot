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
  image: string;
  synthetic: boolean;
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
  hoodieSize: string;
  pantsSize: string;
  glovesSize: string;
  ethAddress: string;
  burnTxHash: string;
};
