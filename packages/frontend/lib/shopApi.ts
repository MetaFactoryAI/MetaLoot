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
    refetchInterval: checkoutId ? 5000 : false,
  },
);

export const createSwapsCheckout = async (
  {
    selectedBag,
    ethAddress,
  }: CheckoutOptions,
  signature: string,
): Promise<CheckoutData> =>
  resolved(() => {
    const tokenId = selectedBag.tokenId || 'unknown tokenId';
    const createRes = mutation.checkoutCreate({
      input: {
        lineItems: [
          {
            quantity: 1,
            customAttributes: [
              { key: 'tokenId', value: tokenId },
              {
                key: 'name',
                value: selectedBag.name,
              },
              { key: '__image', value: selectedBag.image },
              { key: '__signature', value: signature },
            ],
            variantId: CONFIG.swapsVariantId,
          },
        ],
        customAttributes: [
          { value: ethAddress, key: 'Ethereum Address' },
          { value: tokenId, key: 'tokenId' },
        ],
      },
    });

    const data: CheckoutData = {
      id: createRes?.checkout?.id,
      url: createRes?.checkout?.webUrl,
    };
    return data;
  });
