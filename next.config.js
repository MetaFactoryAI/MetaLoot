// eslint-disable-next-line
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withTM = require('next-transpile-modules')(['eth-hooks']);

module.exports = withPlugins([withTM, withImages], {
  // ...
});
