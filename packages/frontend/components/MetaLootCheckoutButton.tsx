import { Button, useBreakpointValue, useToast } from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import React, { useState } from 'react';

import { getCheckoutUrlForOrder } from '@/lib/checkoutSignature';
import { useCheckoutStore } from '@/state/useCheckoutStore';

type Props = {
  numUnredeemed: number;
};
export const MetaLootCheckoutButton: React.FC<Props> = ({ numUnredeemed }) => {
  const { address, provider } = useWallet();
  const selectedBag = useCheckoutStore((s) => s.selectedBag);
  const setCheckoutData = useCheckoutStore((s) => s.setCheckoutData);

  const [isSigning, setIsSigning] = useState(false);

  const toast = useToast();

  const canCheckout =
    address && provider && selectedBag;

  const handleCheckout = async () => {
    if (!canCheckout) return;

    setIsSigning(true);
    try {
      const res = await getCheckoutUrlForOrder(
        {
          ethAddress: address,
          selectedBag,
        },
        provider,
      );
      setIsSigning(false);

      if ('error' in res) {
        toast({
          title: 'Unable to checkout',
          description: res.error.message,
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
      disabled={!canCheckout || isSigning}
      isLoading={isSigning}
      loadingText={isSigning ? 'Confirming' : 'Redeeming'}
    >
      {numUnredeemed > 0 ? 'Confirm' : 'Redeem'}
    </Button>
  );
};
