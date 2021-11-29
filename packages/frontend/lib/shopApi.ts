import { gql, GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';

import { CONFIG } from '@/config';
import { mutation, resolved } from '@/graphql-client';
import { CheckoutData, CheckoutOptions } from '@/lib/types';

const client = new GraphQLClient(CONFIG.shopEndpoint, {
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': CONFIG.shopAccessToken,
  },
});

export const useCheckout = (checkoutId: string | null | undefined) =>
  useQuery<{ id: string; completedAt: string; orderStatusUrl: string }>(
    ['checkout', checkoutId],
    async () => {
      if (!checkoutId) return null;
      const res = await client.request(
        gql`
          query getCheckout($checkoutId: ID!) {
            node(id: $checkoutId) {
              id
              ... on Checkout {
                completedAt
                orderStatusUrl
              }
            }
          }
        `,
        { checkoutId },
      );
      return res.node;
    },
    {
      refetchInterval: checkoutId ? 1000 : false,
    },
  );

export const createMetaLootCheckout = async (
  {
    selectedBag,
    hoodieSize,
    pantsSize,
    glovesSize,
    ethAddress,
    burnTxHash,
  }: CheckoutOptions,
  signature: string,
): Promise<CheckoutData> =>
  resolved(() => {
    const createRes = mutation.checkoutCreate({
      input: {
        lineItems: [
          {
            quantity: 1,
            customAttributes: [
              { key: 'bagNumber', value: selectedBag.id },
              {
                key: 'isSynthetic',
                value: selectedBag.synthetic ? 'true' : 'false',
              },
              { key: 'hoodieSize', value: hoodieSize },
              { key: 'pantsSize', value: pantsSize },
              { key: 'glovesSize', value: glovesSize },
              { key: '__image', value: selectedBag.image },
              { key: '__signature', value: signature },
            ],
            variantId: CONFIG.metalootVariantId,
          },
        ],
        customAttributes: [
          { value: ethAddress, key: 'Ethereum Address' },
          { value: burnTxHash, key: 'burnTxHash' },
        ],
      },
    });

    const data: CheckoutData = {
      id: createRes?.checkout?.id,
      url: createRes?.checkout?.webUrl,
    };
    return data;
  });
