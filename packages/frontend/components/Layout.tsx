import { Container, Flex, HStack, Image } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

import { LoginButton } from './LoginButton';
import { NextChakraLink } from './NextChakraLink';

type Props = {
  children?: ReactNode;
  stickyBottom?: ReactNode;
  title?: string;
  description?: string;
};

export const Layout: React.FC<Props> = ({
                                          children,
                                          stickyBottom,
                                          title = 'Swaps by Coldie | MetaFactory',
                                          description = 'Redeem Swaps Tees',
                                        }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta property="og:title" content={title} key="ogtitle"/>
      <meta property="og:description" content={description} key="ogdesc"/>
      <meta
        property="og:image"
        content="https://swaps.metafactory.ai/banner.png"
        key="ogimage"
      />
      <meta name="twitter:creator" content="@Coldie" key="twhandle"/>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
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
              <Image src="swaps-logo-wide.png" height={75} display={['none', 'flex']} alt="Swaps by Coldie"/>
              <Image src="swaps-logo.png" height={75} display={['flex', 'none']} my={2} alt="Swaps by Coldie"/>
            </NextChakraLink>
          </nav>
          <HStack spacing={[2, 4]}>
            <LoginButton/>
          </HStack>
        </Flex>
      </header>
      {children}
    </Container>
    {stickyBottom}
  </div>
);
