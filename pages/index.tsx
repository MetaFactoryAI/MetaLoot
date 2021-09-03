import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Layout } from 'components/Layout';
import { LoadingState } from 'components/LoadingState';
import { InferGetStaticPropsType } from 'next';
import React, { useMemo } from 'react';
import { isNotNullOrUndefined } from 'utils/typeHelpers';

import { LootBagCard } from '../components/LootBagCard';
import { useWeb3 } from '../lib/hooks';
import { useLoot } from '../lib/useOpenSeaCollectibles';
import { useSyntheticLoot } from '../lib/useSyntheticLoot';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const IndexPage: React.FC<Props> = () => {
  const { data, isLoading } = useLoot();
  const { isConnected, address, provider } = useWeb3();
  const synthData = useSyntheticLoot(provider, address);

  const lootData = useMemo(
    () => [synthData, ...(data || [])].filter(isNotNullOrUndefined),
    [synthData, data],
  );

  return (
    <Layout>
      <Box textAlign="center" my="16">
        {isConnected && address && provider ? (
          <Stack spacing={8}>
            <Text fontFamily="heading" fontSize="3xl">
              Get loot for your Loot bags for 250 $AGLD.
            </Text>
            <LoadingState loading={isLoading} />
            {lootData?.length ? (
              <SimpleGrid spacing={6} columns={{ base: 1, md: 2, lg: 3 }}>
                {lootData.map((loot) => (
                  <LootBagCard
                    imageUrl={loot.image}
                    name={loot.name}
                    key={loot.name}
                    synthetic={loot.synthetic}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Heading>No Loot Found In Wallet</Heading>
            )}
          </Stack>
        ) : (
          <Heading as="h2" size="2xl">
            Connect Wallet
          </Heading>
        )}
      </Box>
    </Layout>
  );
};

export default IndexPage;
