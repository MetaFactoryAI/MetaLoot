import { ExternalLinkIcon } from '@chakra-ui/icons';
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
import React, { useEffect } from 'react';

import { ConfirmedCheckoutModal } from '@/components/ConfirmedCheckoutModal';
import { Layout } from '@/components/Layout';
import { LoadingState } from '@/components/LoadingState';
import { LootBagCard } from '@/components/LootBagCard';
import { MetaLootCheckoutButton } from '@/components/MetaLootCheckoutButton';
import { ProductSelectModal } from '@/components/ProductSelectModal';
import { CONFIG } from '@/config';
import { useCheckout } from '@/lib/shopApi';
import { LootMetadata } from '@/lib/types';
import {
  useMetaLootContract,
  useTypedContractReader,
} from '@/lib/useContracts';
import { useUnredeemedNfts } from '@/lib/useMetaLootBurnEvents';
import { useSwaps } from '@/lib/useOpenSeaCollectibles';
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

  const { isConnected, provider, address } = useWallet();

  const mySwaps = useSwaps(address);
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

  const unredeemedQuery = useUnredeemedNfts();

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

  const swapsData = mySwaps.data || [];

  const isLoading = mySwaps.isLoading || readNumOwned.isLoading;

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
            <LoadingState loading={isLoading}/>
            {/* eslint-disable-next-line no-nested-ternary */}
            {canCraft ? (
              <Heading textAlign="center">
                Select the Swap you want to redeem
              </Heading>
            ) : isLoading ? null : (
              <>
                <Heading textAlign="center">
                  You don&apos;t have any Swaps
                </Heading>
                <Button
                  as="a"
                  alignSelf="center"
                  variant="primary"
                  href="https://opensea.io/collection/swaps-by-coldie"
                  target="_blank"
                  rightIcon={<ExternalLinkIcon />}
                >
                  View on OpenSea
                </Button>
              </>
            )}

            <SimpleGrid
              spacing={6}
              columns={{
                base: 2,
                sm: Math.min(swapsData.length, 2),
                lg: Math.min(swapsData.length, 3),
              }}
              display={canCraft ? undefined : 'none'}
            >
              {swapsData.map((loot) => (
                <LootBagCard
                  imageUrl={loot.image}
                  name={loot.name}
                  key={loot.tokenId}
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
            <MetaLootCheckoutButton numUnredeemed={numUnredeemed}/>
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
