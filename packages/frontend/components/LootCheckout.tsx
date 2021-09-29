import { Button } from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import React from 'react';

import { CheckoutCreateInput, useMutation } from '@/graphql-client';
import { LootMetadata } from '@/lib/types';

type Props = {
  lootBags: LootMetadata[];
};

export const LootCheckout: React.FC<Props> = ({ lootBags }) => {
  const { address } = useWallet();
  //
  // const productQuery = useQuery({
  //   prepare({ prepass, query }) {
  //     prepass(query.productByHandle, 'id', 'title');
  //   },
  // });

  const [checkout] = useMutation((mutation, input: CheckoutCreateInput) => {
    const createRes = mutation.checkoutCreate({ input });
    const checkoutData = { id: createRes?.checkout?.id };
    console.log({ checkoutData });
    return checkoutData;
  });

  return (
    <Button
      onClick={() => {
        checkout({
          args: {
            lineItems: lootBags.map((l) => ({
              quantity: 1,
              customAttributes: [{ key: 'bagNumber', value: l.id }],
              variantId: '',
            })),
            customAttributes: address
              ? [{ value: address, key: 'Ethereum Address' }]
              : [],
          },
        });
      }}
    >
      Checkout
    </Button>
  );
};
