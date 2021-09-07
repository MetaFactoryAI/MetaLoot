/**
 * @type {import("@gqless/cli").GQlessConfig}
 */
const config = {
  react: true,
  scalarTypes: { DateTime: 'string' },
  introspection: {
    endpoint: 'https://metafactory.myshopify.com/api/2021-07/graphql.json',
    headers: {
      'X-Shopify-Storefront-Access-Token': '177da7cc25f80a0ccc80d11f073f5666'
    },
  },
  destination: './graphql-client/index.ts',
  subscriptions: false,
  javascriptOutput: false,
};

module.exports = config;
