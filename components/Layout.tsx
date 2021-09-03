import { Container, Flex, Heading, HStack } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LoginButton } from './LoginButton';
import { NextChakraLink } from './NextChakraLink';

type Props = {
  children?: ReactNode;
  title?: string;
};

export const Layout: React.FC<Props> = ({ children, title = 'MetaLoot' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Container maxWidth="1200px">
      <header>
        <Flex py={[0, 4]} justifyContent="space-between" alignItems="center">
          <Flex justifyContent="space-between" alignItems="center">
            <nav>
              <HStack spacing={[4, 8, 12]}>
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
              </HStack>
            </nav>
          </Flex>
          <HStack>
            <ColorModeSwitcher justifySelf="flex-end" />
            <LoginButton />
          </HStack>
        </Flex>
      </header>
      {children}
    </Container>
  </div>
);
