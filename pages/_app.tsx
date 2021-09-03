import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';

import { ChakraProvider } from '@chakra-ui/react';
import { CONFIG } from 'config';
import { Web3ContextProvider } from 'contexts/Web3Context';
import { theme } from 'lib/theme';
import { AppProps } from 'next/app';
import { withUrqlClient } from 'next-urql';
import React from 'react';

const app: React.FC<AppProps> = ({ pageProps, Component }) => (
  <ChakraProvider theme={theme}>
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  </ChakraProvider>
);

export default withUrqlClient(
  (_ssrExchange, ctx) => ({
    url: CONFIG.graphqlURL,
    fetchOptions: () => ({
      headers: {
        Authorization: `Bearer ${ctx?.req?.headers?.authorization ?? ''}`,
      },
    }),
  }),
  {
    neverSuspend: true,
  },
)(app);
