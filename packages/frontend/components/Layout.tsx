import { Container, Flex, Heading, HStack } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

import { TokenBalance } from '@/components/TokenBalance';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LoginButton } from './LoginButton';
import { NextChakraLink } from './NextChakraLink';

type Props = {
  children?: ReactNode;
  stickyBottom?: ReactNode;
  title?: string;
};

export const Layout: React.FC<Props> = ({
  children,
  stickyBottom,
  title = 'MetaLoot',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Container maxW="container.lg">
      <header>
        <Flex py={[3, 4]} justifyContent="space-between">
          <nav>
            <NextChakraLink
              href="/"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Heading size="lg" pointerEvents="none" mx={[2, 4]}>
                MetaLoot
              </Heading>
            </NextChakraLink>
          </nav>
          <HStack spacing={[2, 4]}>
            <ColorModeSwitcher />
            <TokenBalance />
            <LoginButton />
          </HStack>
        </Flex>
      </header>
      {children}
    </Container>
    {stickyBottom}
  </div>
);
