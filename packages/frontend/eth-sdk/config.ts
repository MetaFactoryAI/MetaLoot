// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  outputPath: './eth-sdk/__generated__',
  contracts: {
    mainnet: {
      swaps: '0xcd327d27f64b9bd998c7fde6bf279ad542750826',
    },
  },
})
