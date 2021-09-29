import {
  Box,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { InferGetStaticPropsType } from 'next';
import React, { useEffect, useMemo, useState } from 'react';

import { AlertModal } from '@/components/AlertModal';
import { BottomBar } from '@/components/BottomBar';
import { Layout } from '@/components/Layout';
import { LoadingState } from '@/components/LoadingState';
import { LootBagCard } from '@/components/LootBagCard';
import { MetaImage } from '@/components/MetaImage';
import { ProductSelectModal } from '@/components/ProductSelectModal';
import { CONFIG } from '@/config';
import { maybePluralize } from '@/lib/stringHelpers';
import { isNotNullOrUndefined } from '@/lib/typeHelpers';
import { CheckoutLineItem, LootMetadata } from '@/lib/types';
import { useAgldBalance } from '@/lib/useContracts';
import { useLoot } from '@/lib/useOpenSeaCollectibles';
import { useSyntheticLoot } from '@/lib/useSyntheticLoot';
import shirtBack from '@/public/shirtBack.png';
import shirtFront from '@/public/shirtFront.png';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const ShirtPage: React.FC<Props> = () => {
  const [selectedBag, setSelectedBag] = useState<LootMetadata>();

  const [lineItems, setLineItems] = useState<CheckoutLineItem[]>([]);
  const { data, isLoading } = useLoot();
  const { isConnected, address, provider } = useWallet();
  const synthData = useSyntheticLoot(address);
  const modal = useDisclosure();
  const alertModal = useDisclosure();

  const agldBalance = useAgldBalance();
  const cartTotal = lineItems.length * CONFIG.itemPrice;

  useEffect(() => {
    setLineItems([]);
  }, [address]);

  const lootData = useMemo(
    () => [synthData, ...(data || [])].filter(isNotNullOrUndefined),
    [data, synthData],
  );

  const onCraft = (loot: LootMetadata) => {
    if (agldBalance - cartTotal <= 0) {
      alertModal.onOpen();
    } else {
      setSelectedBag(loot);
      modal.onOpen();
    }
  };

  const addLineItem = (item: CheckoutLineItem) => {
    setLineItems((items) => [...items, item]);
  };

  const removeFromCart = (loot: LootMetadata) => {
    setLineItems((items) => items.filter((i) => i.lootId !== loot.id));
  };

  const isBottomBarVisible = lineItems.length > 0;
  const mockupLoot = selectedBag || synthData;

  return (
    <Layout>
      <Box my={[2, 4]}>
        <SimpleGrid spacing={4} columns={[1, 2]} mt={4} px={4}>
          <MetaImage
            src={shirtFront}
            alt="Loot Shirt Front"
            placeholder="empty"
            w="auto"
            h="auto"
            objectFit="contain"
          />
          <Flex align="center" justify="center" position="relative">
            <MetaImage
              src={shirtBack}
              alt="Loot Shirt Back"
              placeholder="blur"
              w="auto"
              h="auto"
              objectFit="contain"
            />
            {mockupLoot?.image ? (
              <Image
                src={mockupLoot.image}
                ignoreFallback
                w="65%"
                h="65%"
                left="5%"
                position="absolute"
                mixBlendMode="exclusion"
                transform="rotate(90deg)"
                opacity={0.4}
              />
            ) : null}
            {mockupLoot?.name ? (
              <Text
                position="absolute"
                mixBlendMode="exclusion"
                opacity={0.3}
                fontSize={mockupLoot.synthetic ? 'xs' : 'sm'}
                fontWeight="bold"
                fontFamily="heading"
                bottom="10%"
                left="5%"
                right={0}
                textAlign="center"
                color="white"
              >
                {mockupLoot.name.replace('Bag ', '')}
              </Text>
            ) : null}
          </Flex>
        </SimpleGrid>

        {isConnected && address && provider ? (
          <Stack spacing={8} mt={4}>
            <LoadingState loading={isLoading || !lootData.length} />
            <SimpleGrid
              spacing={6}
              columns={{
                base: 1,
                sm: Math.min(lootData.length, 2),
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
                  onCraft={() => onCraft(loot)}
                  onRemove={() => removeFromCart(loot)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        ) : (
          <Heading my="20" color="gray.300" textAlign="center">
            Connect Wallet to Continue
          </Heading>
        )}
        <ProductSelectModal
          isOpen={modal.isOpen}
          onClose={modal.onClose}
          selectedBag={selectedBag}
          addLineItem={addLineItem}
        />
        <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.onClose} />
        <BottomBar isOpen={isBottomBarVisible}>
          <Stack spacing={1} alignItems="flex-start">
            <Heading size="lg" color="white">
              {maybePluralize(lineItems.length, 'item')} in bag
            </Heading>
            <Text fontSize={['md', 'lg']} color="gray.100">
              {cartTotal} AGLD
            </Text>
          </Stack>
        </BottomBar>
        <Box py={isBottomBarVisible ? 16 : 0} />
      </Box>
    </Layout>
  );
};

export default ShirtPage;
