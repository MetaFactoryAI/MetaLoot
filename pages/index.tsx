import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import React, { useMemo } from 'react';

import { Layout } from '@/components/Layout';
import { LoadingState } from '@/components/LoadingState';
import { LootBagCard } from '@/components/LootBagCard';
import { useQuery } from '@/graphql-client';
import { useWeb3 } from '@/lib/hooks';
import { useLoot } from '@/lib/useOpenSeaCollectibles';
import { useSyntheticLoot } from '@/lib/useSyntheticLoot';
import { isNotNullOrUndefined } from '@/utils/typeHelpers';

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
    [data, synthData],
  );

  const query = useQuery();

  const products = query
    .products({ first: 5 })
    .edges.map((e) => ({ title: e.node.title, id: e.node.id }));

  console.log(products);
  return (
    <Layout>
      <Box textAlign="center" my="16">
        <Heading fontFamily="heading" fontSize="4xl">
          Premium apparel for your Loot bags
        </Heading>
        {isConnected && address && provider ? (
          <Stack spacing={8}>
            <LoadingState loading={isLoading} />
            {lootData?.length ? (
              <SimpleGrid
                spacing={6}
                columns={{
                  base: 1,
                  md: Math.min(lootData.length, 2),
                  lg: Math.min(lootData.length, 3),
                }}
              >
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
          <Text mt="10" fontFamily="mono" fontSize="xl" color="gray.500">
            Connect Wallet to Continue
          </Text>
        )}
      </Box>
    </Layout>
  );
};

export default IndexPage;
