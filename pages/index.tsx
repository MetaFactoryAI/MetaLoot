import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import React, { useEffect, useMemo, useState } from 'react';

import { BottomBar } from '@/components/BottomBar';
import { Layout } from '@/components/Layout';
import { LoadingState } from '@/components/LoadingState';
import { LootBagCard } from '@/components/LootBagCard';
import { ProductSelectModal } from '@/components/ProductSelectModal';
import { CONFIG } from '@/config';
import { CheckoutLineItem, LootMetadata } from '@/lib/types';
import { useLoot } from '@/lib/useOpenSeaCollectibles';
import { useSyntheticLoot } from '@/lib/useSyntheticLoot';
import { useWeb3 } from '@/lib/useWeb3';
import { maybePluralize } from '@/lib/stringHelpers';
import { isNotNullOrUndefined } from '@/lib/typeHelpers';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const IndexPage: React.FC<Props> = () => {
  const [selectedBag, setSelectedBag] = useState<LootMetadata>();

  const [lineItems, setLineItems] = useState<CheckoutLineItem[]>([]);
  const { data, isLoading } = useLoot();
  const { isConnected, address, provider } = useWeb3();
  const synthData = useSyntheticLoot(provider, address);
  const modal = useDisclosure();

  useEffect(() => {
    setLineItems([]);
  }, [address]);

  const lootData = useMemo(
    () => [synthData, ...(data || [])].filter(isNotNullOrUndefined),
    [data, synthData],
  );

  const addLineItem = (item: CheckoutLineItem) => {
    setLineItems((items) => [...items, item]);
  };

  const removeFromCart = (loot: LootMetadata) => {
    setLineItems((items) => items.filter((i) => i.lootId !== loot.id));
  };

  const isBottomBarVisible = lineItems.length > 0;

  return (
    <Layout>
      <Box my={[2, 6, 8]} textAlign="center">
        <Heading fontFamily="heading" fontSize="6xl">
          MetaLoot
        </Heading>
        <Heading fontFamily="heading" fontSize="2xl" fontWeight="normal">
          Premium apparel for your Loot bags
        </Heading>
        {isConnected && address && provider ? (
          <Stack spacing={8} mt={4}>
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
                    key={loot.id}
                    synthetic={loot.synthetic}
                    isInCart={Boolean(
                      lineItems.find((i) => i.lootId === loot.id),
                    )}
                    onCraft={() => {
                      setSelectedBag(loot);
                      modal.onOpen();
                    }}
                    onRemove={() => removeFromCart(loot)}
                  />
                ))}
              </SimpleGrid>
            ) : null}
          </Stack>
        ) : (
          <Text mt="20" fontFamily="mono" fontSize="xl" color="gray.500">
            Connect Wallet to Continue
          </Text>
        )}
        <ProductSelectModal
          isOpen={modal.isOpen}
          onClose={modal.onClose}
          selectedBag={selectedBag}
          addLineItem={addLineItem}
        />
        <BottomBar isOpen={isBottomBarVisible}>
          <Stack spacing={1} alignItems="flex-start">
            <Heading size="lg" color="white">
              {maybePluralize(lineItems.length, 'item')} in bag
            </Heading>
            <Text size="xl" color="gray.100">
              {lineItems.length * CONFIG.itemPrice} AGLD
            </Text>
          </Stack>
        </BottomBar>
        <Box py={isBottomBarVisible ? 16 : 0} />
      </Box>
    </Layout>
  );
};

export default IndexPage;
