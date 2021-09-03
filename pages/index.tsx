import { Box, Grid, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Layout } from 'components/Layout';
import { LoadingState } from 'components/LoadingState';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

import { HashMaskCard } from '../components/HashMaskCard';
import { useWeb3 } from '../lib/hooks';
import { useHashMasks } from '../lib/useOpenSeaCollectibles';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const IndexPage: React.FC<Props> = () => {
  const { data, loading } = useHashMasks();
  const { isConnected } = useWeb3();

  return (
    <Layout>
      <Box textAlign="center" fontSize="xl">
        <Grid p={3}>
          {isConnected ? (
            <VStack spacing={8}>
              <LoadingState loading={loading} />
              {data?.length ? (
                <SimpleGrid>
                  {data.map((mask) => (
                    <HashMaskCard mask={mask} key={mask.tokenId} />
                  ))}
                </SimpleGrid>
              ) : (
                <Heading size="md">No Hashmasks Found In Wallet</Heading>
              )}
              <Text>
                HashMasks are dope, buy a framed print for $199. <br /> Each
                Mask can only be printed once, unless the name changes.
              </Text>

              {/*  <br />
                <br />
                <NextChakraLink href="/properties" color="teal.500">
                  View the properties
                </NextChakraLink>{' '}
                to see the Nextjs <Code fontSize="xl">&lt;Link&gt;</Code> in
                action
              </Text>
              <Link
                color="teal.500"
                fontSize="2xl"
                href="https://chakra-ui.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about Chakra
              </Link> */}
            </VStack>
          ) : (
            <Heading as="h2" size="2xl">
              Loot
            </Heading>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default IndexPage;
