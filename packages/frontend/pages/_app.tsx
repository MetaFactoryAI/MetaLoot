import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/jetbrains-mono/500.css';

import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CONFIG } from '@/config';
import { Web3ContextProvider } from '@/contexts/Web3Context';
import { theme } from '@/lib/theme';

const queryClient = new QueryClient();

const app: React.FC<AppProps> = ({ pageProps, Component }) => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Web3ContextProvider>
        <Component {...pageProps} />
      </Web3ContextProvider>
    </QueryClientProvider>
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
