import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useRadioGroup,
  VStack,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

import { RadioButton } from '@/components/RadioButton';
import { useQuery } from '@/graphql-client';
import { CheckoutLineItem, LootMetadata } from '@/lib/types';
import { isNotNullOrUndefined } from '@/utils/typeHelpers';

const LOOT_PRODUCT_HANDLE = 'loot-bag-long-sleeve-shirt';

export type Variant = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedBag: LootMetadata | undefined;
  addLineItem: (lineItem: CheckoutLineItem) => void;
};

export const ProductSelectModal: React.FC<Props> = ({
  // lootBags,
  isOpen,
  onClose,
  selectedBag,
  addLineItem,
}) => {
  const initialRef = useRef<HTMLButtonElement | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const productQuery = useQuery();

  const variants: Variant[] | undefined = productQuery
    .productByHandle({ handle: LOOT_PRODUCT_HANDLE })
    ?.variants({ first: 5 })
    .edges.map((e) =>
      e.node.id && e.node.title ? { id: e.node.id, name: e.node.title } : null,
    )
    .filter(isNotNullOrUndefined);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'size',
    value: selectedSize,
    onChange: setSelectedSize,
  });

  const onAddToBag = () => {
    if (!selectedSize || !selectedBag) return;

    const variant = variants?.find((v) => v.name === selectedSize);

    if (!variant) return;

    addLineItem({
      variantId: variant.id,
      lootId: selectedBag.id,
    });
    onClose();
  };

  const radioGroupProps = getRootProps();

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius="none">
        <ModalCloseButton color="gray.300" />
        <ModalBody m={4}>
          <VStack spacing={8}>
            <Heading size="lg" fontWeight="normal">
              Size
            </Heading>
            <Stack direction="row" spacing={0} {...radioGroupProps}>
              {variants?.map((v) => (
                <RadioButton
                  key={v.id || 0}
                  {...getRadioProps({ value: v.name })}
                >
                  {v.name}
                </RadioButton>
              ))}
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center" mb={1}>
          <Button variant="primary" ref={initialRef} onClick={onAddToBag}>
            Add to Bag
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
