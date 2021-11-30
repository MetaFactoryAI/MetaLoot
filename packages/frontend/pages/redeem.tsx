import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import { ConfirmedCheckoutModal } from '@/components/ConfirmedCheckoutModal';
import { Layout } from '@/components/Layout';
import { LoadingState } from '@/components/LoadingState';
import { LootBagCard } from '@/components/LootBagCard';
import { MetaLootCheckoutButton } from '@/components/MetaLootCheckoutButton';
import { NextChakraLink } from '@/components/NextChakraLink';
import { ProductSelectModal } from '@/components/ProductSelectModal';
import { CONFIG } from '@/config';
import { useCheckout } from '@/lib/shopApi';
import { isNotNullOrUndefined } from '@/lib/typeHelpers';
import { LootMetadata } from '@/lib/types';
import {
  useMetaLootContract,
  useTypedContractReader,
} from '@/lib/useContracts';
import { useUnredeemedBurns } from '@/lib/useMetaLootBurnEvents';
import { useLoot } from '@/lib/useOpenSeaCollectibles';
import { useSyntheticLoot } from '@/lib/useSyntheticLoot';
import { useCheckoutStore } from '@/state/useCheckoutStore';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const RedeemPage: React.FC<Props> = () => {
  const setSelectedBag = useCheckoutStore((s) => s.setSelectedBag);
  const resetCart = useCheckoutStore((s) => s.resetCart);
  const checkoutData = useCheckoutStore((s) => s.checkoutData);
  const router = useRouter();

  const { isConnected, address, provider } = useWallet();
  const myLoot = useLoot(address);
  const synthData = useSyntheticLoot(address);
  const modal = useDisclosure();
  const confirmModal = useDisclosure();

  const metaLoot = useMetaLootContract();

  const readNumOwned = useTypedContractReader(
    metaLoot,
    'balanceOf',
    address || '',
    CONFIG.redeemTokenId,
  )();
  const numOwned = readNumOwned.data?.toNumber() || 0;

  const unredeemedQuery = useUnredeemedBurns();

  const numUnredeemed = unredeemedQuery.events?.length || 0;
  const { data: checkout } = useCheckout(checkoutData?.id);
  const orderStatusUrl = checkout?.orderStatusUrl;

  useEffect(() => {
    resetCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (checkoutData) {
      modal.onClose();
      confirmModal.onOpen();
      readNumOwned.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData]);

  const handleConfirmationClose = () => {
    if (orderStatusUrl) {
      resetCart();
      readNumOwned.refetch();
      confirmModal.onClose();
      router.push('/');
    }
  };

  const lootData = useMemo(
    () => [synthData, ...(myLoot.data || [])].filter(isNotNullOrUndefined),
    [myLoot.data, synthData],
  );

  const isLoading = myLoot.isLoading || readNumOwned.isLoading;
  const canCraft = !isLoading && (numOwned > 0 || numUnredeemed > 0);

  const onCraft = (loot: LootMetadata) => {
    if (checkout && !checkout.completedAt) {
      confirmModal.onOpen();
    } else if (canCraft) {
      setSelectedBag(loot);
      modal.onOpen();
    }
  };

  return (
    <Layout>
      <Box my={[2, 4]}>
        {isConnected && address && provider ? (
          <Stack spacing={8} mt={4}>
            <LoadingState loading={isLoading || !lootData.length} />
            {/* eslint-disable-next-line no-nested-ternary */}
            {canCraft ? (
              <Heading textAlign="center" fontWeight="normal">
                Select the Loot you want to craft
              </Heading>
            ) : isLoading ? null : (
              <>
                <Heading textAlign="center" fontWeight="normal">
                  You don&apos;t have any ML.01
                </Heading>
                <NextChakraLink
                  alignSelf="center"
                  href="/"
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  <Button variant="primary" leftIcon={<ArrowBackIcon />}>
                    Back to Mint
                  </Button>
                </NextChakraLink>
              </>
            )}

            <SimpleGrid
              spacing={6}
              columns={{
                base: 2,
                sm: Math.min(lootData.length, 2),
                lg: Math.min(lootData.length, 3),
              }}
              display={canCraft ? undefined : 'none'}
            >
              {lootData.map((loot) => (
                <LootBagCard
                  imageUrl={loot.image}
                  name={loot.name}
                  key={loot.id}
                  synthetic={loot.synthetic}
                  onCraft={() => onCraft(loot)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        ) : (
          <Heading my="20" color="gray.300" textAlign="center">
            Connect Wallet to Continue
          </Heading>
        )}
        <ProductSelectModal isOpen={modal.isOpen} onClose={modal.onClose}>
          {provider && address ? (
            <MetaLootCheckoutButton numUnredeemed={numUnredeemed} />
          ) : null}
        </ProductSelectModal>
        <ConfirmedCheckoutModal
          isOpen={confirmModal.isOpen}
          onClose={handleConfirmationClose}
          checkoutUrl={checkoutData?.url}
          checkoutCompleteUrl={orderStatusUrl}
        />
      </Box>
    </Layout>
  );
};

export default RedeemPage;
