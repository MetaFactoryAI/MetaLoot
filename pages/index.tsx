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
        <Heading fontFamily="heading" fontSize="4xl">
          Premium apparel for your Loot bags
        </Heading>
        {isConnected && address && provider ? (
          <Stack spacing={8}>
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
          <Text mt="10" fontFamily="mono" fontSize="xl" color="gray.500">
            Connect Wallet to Continue
          </Text>
        )}
      </Box>
    </Layout>
  );
};

export default IndexPage;
