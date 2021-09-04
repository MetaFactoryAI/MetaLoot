import { Container, Flex, Heading } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

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
    <Container maxWidth="1200px">
      <header>
        <Flex py={[3, 4]} justifyContent="space-between" alignItems="baseline">
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
                ML
              </Heading>
            </NextChakraLink>
          </nav>
          <LoginButton />
        </Flex>
      </header>
      {children}
    </Container>
    {stickyBottom}
  </div>
);
