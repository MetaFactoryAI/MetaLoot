// eslint-disable-next-line
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['eth-hooks']);

module.exports = withPlugins([withTM], {
  experimental: { esmExternals: true },
});
