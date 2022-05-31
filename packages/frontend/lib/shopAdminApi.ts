import { gql, GraphQLClient } from 'graphql-request';

import { CONFIG } from '@/config';
import { OrderLineItemEdge } from '@/graphql-client';

const adminClient = new GraphQLClient(CONFIG.shopAdminEndpoint, {
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': CONFIG.shopAdminToken,
  },
});

const swapsOrdersQuery = gql`
  query metaLootOrders($after: String) {
    orders(query: "tag:swaps-redemption", first: 250, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
`;

export const findOrderWithTokenId = (
  edges: OrderLineItemEdge[],
  tokenId: string,
) =>
  edges.find((e) =>
    e.node.customAttributes.find(({ value }) => value === tokenId),
  );

export const getSwapsOrderForTokenId = async (tokenId: string) => {
  const res = await adminClient.request(swapsOrdersQuery);

  let existingOrder = findOrderWithTokenId(res.orders.edges, tokenId);
  if (existingOrder) {
    return existingOrder.node;
  }

  // paginate results in case there's more than 250 orders
  if (res.orders.pageInfo.hasNextPage) {
    const lastEdge = res.orders.edges[res.orders.edges.length - 1];
    const nextRes = await adminClient.request(swapsOrdersQuery, {
      after: lastEdge.cursor,
    });
    existingOrder = findOrderWithTokenId(nextRes.orders.edges, tokenId);
    if (existingOrder) {
      return existingOrder.node;
    }
  }

  return null;
};

export const getMetaLootOrders = async (): Promise<OrderLineItemEdge[]> => {
  const orders = [];
  const res = await adminClient.request(swapsOrdersQuery);
  orders.push(...res.orders.edges);

  // paginate results in case there's more than 250 orders
  if (res.orders.pageInfo.hasNextPage) {
    const lastEdge = res.orders.edges[res.orders.edges.length - 1];
    const nextRes = await adminClient.request(swapsOrdersQuery, {
      after: lastEdge.cursor,
    });
    orders.push(...nextRes.orders.edges);
  }

  return orders;
};
