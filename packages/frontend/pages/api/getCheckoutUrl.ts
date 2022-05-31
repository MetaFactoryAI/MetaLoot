import type { NextApiHandler } from 'next';

import { verifyOrderSignature } from '@/lib/checkoutSignature';
import { getSwapsOrderForTokenId } from '@/lib/shopAdminApi';
import { createSwapsCheckout } from '@/lib/shopApi';
import { MainnetProvider } from '@/lib/staticProviders';
import { CheckoutData } from '@/lib/types';
import { fetchOwnerOfSwap } from "@/lib/useOpenSeaCollectibles";


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
  if (!orderData.selectedBag.tokenId) {
    res.status(401).send('Invalid tokenId');
    return;
  }

  try {
    const {tokenId} = orderData.selectedBag;
    const ownerAddress = await fetchOwnerOfSwap(tokenId)

    if (!ownerAddress || (ownerAddress.toLowerCase() !== orderData.ethAddress.toLowerCase())) {
      res.status(401).send('You are not the owner of this NFT');
      return
    }

    const existingOrder = await getSwapsOrderForTokenId(
      tokenId,
    );

    if (existingOrder) {
      res.status(400).send('Already redeemed');
      return;
    }

    const checkoutData = await createSwapsCheckout(orderData, signature);
    res.status(200).json(checkoutData);
  } catch (e) {
    console.warn(e)
    res.status(500).send(`Unable to checkout: ${(e as Error).message}`);
  }
};

export default handler;
