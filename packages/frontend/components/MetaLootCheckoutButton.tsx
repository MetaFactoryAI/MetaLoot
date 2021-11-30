import { Button, useBreakpointValue, useToast } from '@chakra-ui/react';
import { TransactionReceipt } from '@ethersproject/providers';
import { useWallet } from '@meta-cred/usewallet';
import { BigNumber, Event } from 'ethers';
import React, { useState } from 'react';

import { CONFIG } from '@/config';
import { getCheckoutUrlForOrder } from '@/lib/checkoutSignature';
import { useMetaLootContract } from '@/lib/useContracts';
import { getUnredeemedBurns } from '@/lib/useMetaLootBurnEvents';
import { useTransactor } from '@/lib/useTransactor';
import { useCheckoutStore } from '@/state/useCheckoutStore';

type Props = {
  numUnredeemed: number;
};
export const MetaLootCheckoutButton: React.FC<Props> = ({ numUnredeemed }) => {
  const { address, provider } = useWallet();
  const selectedBag = useCheckoutStore((s) => s.selectedBag);
  const hoodieSize = useCheckoutStore((s) => s.hoodieSize);
  const pantsSize = useCheckoutStore((s) => s.pantsSize);
  const glovesSize = useCheckoutStore((s) => s.glovesSize);
  const setCheckoutData = useCheckoutStore((s) => s.setCheckoutData);

  const metaLoot = useMetaLootContract();
  const { watchTx } = useTransactor(provider);
  const [isBurning, setIsBurning] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const toast = useToast();

  const handleBurn = async (): Promise<
    Event | TransactionReceipt | undefined
  > => {
    if (!address) return undefined;

    try {
      setIsBurning(true);

      const events = await getUnredeemedBurns(address);
      const unredeemedBurn = events?.length ? events[0] : null;

      if (unredeemedBurn) {
        setIsBurning(false);
        return unredeemedBurn;
      }

      const burnTx = metaLoot.burn(
        address,
        BigNumber.from(CONFIG.redeemTokenId),
        BigNumber.from(1),
      );

      const res = (await watchTx(burnTx)) as TransactionReceipt | undefined;
      setIsBurning(false);

      return res;
    } catch (e) {
      setIsBurning(false);
      toast({
        title: 'Error redeeming ML.01',
        status: 'error',
        isClosable: true,
      });
      return undefined;
    }
  };

  const canCheckout =
    address && provider && selectedBag && hoodieSize && pantsSize && glovesSize;

  const handleCheckout = async () => {
    if (!canCheckout) return;
    const burnRes = await handleBurn();

    if (!burnRes) return;

    setIsSigning(true);
    try {
      const res = await getCheckoutUrlForOrder(
        {
          hoodieSize,
          pantsSize,
          glovesSize,
          ethAddress: address,
          burnTxHash: burnRes.transactionHash,
          selectedBag,
        },
        provider,
      );
      setIsSigning(false);

      if (!res) {
        toast({
          title: 'Unable to checkout',
          status: 'error',
          isClosable: true,
        });
        return;
      }

      if (res.url) window.open(res.url, '_blank');
      setCheckoutData(res);
    } catch (e) {
      setIsSigning(false);
      toast({
        title: 'Signature declined',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Button
      variant="primary"
      size={useBreakpointValue(['md', 'lg'])}
      justifySelf="flex-end"
      onClick={handleCheckout}
      disabled={!canCheckout || isBurning || isSigning}
      isLoading={isBurning || isSigning}
      loadingText={isSigning ? 'Confirming' : 'Redeeming'}
    >
      {numUnredeemed > 0 ? 'Confirm' : 'Redeem ML.01'}
    </Button>
  );
};
