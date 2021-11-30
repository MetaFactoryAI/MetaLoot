import { constants } from 'ethers';
import { MetaLoot__factory } from 'metaloot-hardhat';
import type { NextApiHandler } from 'next';

import { verifyOrderSignature } from '@/lib/checkoutSignature';
import { getMetaLootOrderForTxHash } from '@/lib/shopAdminApi';
import { createMetaLootCheckout } from '@/lib/shopApi';
import { LocalProvider, MainnetProvider } from '@/lib/staticProviders';
import { CheckoutData } from '@/lib/types';
import { CONTRACT_ADDRESSES } from '@/lib/useContracts';

const metaLoot = MetaLoot__factory.connect(
  CONTRACT_ADDRESSES.MetaLoot,
  LocalProvider,
);

const handler: NextApiHandler<CheckoutData | string> = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST requests allowed');
    return;
  }
  const { orderMessage, signature } = JSON.parse(req.body);
  const orderData = await verifyOrderSignature(
    orderMessage,
    signature,
    MainnetProvider,
  );

  if (!orderData) {
    res.status(401).send('Invalid Signature');
    return;
  }

  try {
    const filter = metaLoot.filters.TransferSingle(
      orderData.ethAddress,
      orderData.ethAddress,
      constants.AddressZero,
    );

    const events = await metaLoot.queryFilter(filter);
    const burnTx = events.find(
      (e) => e.transactionHash === orderData.burnTxHash,
    );
    if (!burnTx) {
      res.status(400).send('Invalid burn TX');
      return;
    }

    const existingOrder = await getMetaLootOrderForTxHash(
      burnTx.transactionHash,
    );
    if (existingOrder) {
      res.status(400).send('Already redeemed');
      return;
    }

    const checkoutData = await createMetaLootCheckout(orderData, signature);
    res.status(200).json(checkoutData);
  } catch (e) {
    res.status(500).send('Unable to checkout');
  }
};

export default handler;
