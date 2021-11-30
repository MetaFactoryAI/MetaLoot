/**
 * GQLESS: You can safely modify this file and Query Fetcher based on your needs
 */

import { createReactClient } from '@gqless/react';
import { createClient, QueryFetcher } from 'gqless';
import { ExecutionResult } from 'graphql';

import { CONFIG } from '@/config';

import {
  GeneratedSchema,
  generatedSchema,
  scalarsEnumsHash,
  SchemaObjectTypes,
  SchemaObjectTypesNames,
} from './schema.generated';

const queryFetcher: QueryFetcher = async (query, variables) => {
  // Modify "https://metafactory.myshopify.com/api/2021-07/graphql.json" if needed
  const response = await fetch(CONFIG.shopEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': CONFIG.shopAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  });

  return (await response.json()) as ExecutionResult;
};

export const client = createClient<
  GeneratedSchema,
  SchemaObjectTypesNames,
  SchemaObjectTypes
>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
});

export const { query, mutation, mutate, subscription, resolved, refetch } =
  client;

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Set this flag as "true" if your usage involves React Suspense
    // Keep in mind that you can overwrite it in a per-hook basis
    suspense: false,

    // Set this flag based on your needs
    staleWhileRevalidate: false,
  },
});

export * from './schema.generated';
