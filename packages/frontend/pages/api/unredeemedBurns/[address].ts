import { constants, Event } from 'ethers';
import { MetaLoot__factory } from 'metaloot-hardhat';
import type { NextApiHandler } from 'next';

import { findOrderWithTxHash, getMetaLootOrders } from '@/lib/shopAdminApi';
import { LocalProvider } from '@/lib/staticProviders';
import { CONTRACT_ADDRESSES } from '@/lib/useContracts';

const metaLoot = MetaLoot__factory.connect(
  CONTRACT_ADDRESSES.MetaLoot,
  LocalProvider,
);

const handler: NextApiHandler<Event[]> = async (req, res) => {
  const address = req.query.address as string;

  const filter = metaLoot.filters.TransferSingle(
    address,
    address,
    constants.AddressZero,
  );

  const events = await metaLoot.queryFilter(filter);
  if (!events.length) {
    res.status(200).json([]);
    return;
  }

  const orders = await getMetaLootOrders();

  const unredeemedBurns = events.filter(
    (e) => !findOrderWithTxHash(orders, e.transactionHash),
  );

  res.status(200).json(unredeemedBurns);
};

export default handler;
