import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/jetbrains-mono/500.css';

import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ThemedWalletProvider } from '@/contexts/ThemedWalletProvider';
import { theme } from '@/theme/theme';

const queryClient = new QueryClient();

const app: React.FC<AppProps> = ({ pageProps, Component }) => (
  <ChakraProvider resetCSS theme={theme}>
    <QueryClientProvider client={queryClient}>
      <ThemedWalletProvider>
        <Component {...pageProps} />
      </ThemedWalletProvider>
    </QueryClientProvider>
  </ChakraProvider>
);

export default app;
