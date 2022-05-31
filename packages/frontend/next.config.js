// eslint-disable-next-line
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['eth-hooks']);

module.exports = withPlugins([withTM], {
  experimental: { esmExternals: true },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/ml01',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ];
  // },
});
