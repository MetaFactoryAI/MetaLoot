import type { NextApiHandler } from 'next';

import { findOrderWithTokenId, getMetaLootOrders } from '@/lib/shopAdminApi';
import { LootMetadata } from "@/lib/types";
import { fetchSwaps } from "@/lib/useOpenSeaCollectibles";


const handler: NextApiHandler<LootMetadata[]> = async (req, res) => {
  const address = req.query.address as string;
  const nfts = await fetchSwaps(address);
  if (!nfts.length) {
    res.status(200).json([]);
    return;
  }

  const orders = await getMetaLootOrders();

  const unredeemedNfts = nfts.filter(
    (e) => e.tokenId && !findOrderWithTokenId(orders, e.tokenId),
  );

  res.status(200).json(unredeemedNfts);
};

export default handler;
