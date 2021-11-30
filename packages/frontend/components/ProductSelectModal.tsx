import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useRadioGroup,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import shallow from 'zustand/shallow';

import { RadioButton } from '@/components/RadioButton';
import { ApparelSize, GloveSize } from '@/lib/types';
import { useCheckoutStore } from '@/state/useCheckoutStore';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const HOODIE_SIZES = [
  ApparelSize.S,
  ApparelSize.M,
  ApparelSize.L,
  ApparelSize.XL,
  ApparelSize.XXL,
  ApparelSize.XXXL,
];

const PANTS_SIZES = [
  ApparelSize.S,
  ApparelSize.M,
  ApparelSize.L,
  ApparelSize.XL,
  ApparelSize.XXL,
];

const GLOVES_SIZES = [GloveSize.SM, GloveSize.LXL];

export const ProductSelectModal: React.FC<Props> = ({
  // lootBags,
  isOpen,
  onClose,
  children,
}) => {
  const [hoodieSize, setHoodieSize] = useCheckoutStore(
    (s) => [s.hoodieSize, s.setHoodieSize],
    shallow,
  );
  const [pantsSize, setPantsSize] = useCheckoutStore(
    (s) => [s.pantsSize, s.setPantsSize],
    shallow,
  );
  const [glovesSize, setGlovesSize] = useCheckoutStore(
    (s) => [s.glovesSize, s.setGlovesSize],
    shallow,
  );

  const initialRef = useRef<HTMLButtonElement | null>(null);

  const hoodieSizeSelector = useRadioGroup({
    name: 'hoodieSize',
    value: hoodieSize || undefined,
    onChange: setHoodieSize,
  });

  const pantsSizeSelector = useRadioGroup({
    name: 'pantsSize',
    value: pantsSize || undefined,
    onChange: setPantsSize,
  });

  const glovesSizeSelector = useRadioGroup({
    name: 'glovesSize',
    value: glovesSize || undefined,
    onChange: setGlovesSize,
  });

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent borderRadius="none">
        <ModalCloseButton color="gray.300" />
        <ModalBody m={4}>
          <Stack alignItems="center" spacing={4}>
            <Heading fontSize="2xl" color="gray.500" fontWeight="normal">
              Hoodie Size
            </Heading>
            <Stack
              direction="row"
              spacing={0}
              {...hoodieSizeSelector.getRootProps()}
            >
              {HOODIE_SIZES?.map((v) => (
                <RadioButton
                  key={v || 0}
                  {...hoodieSizeSelector.getRadioProps({ value: v })}
                >
                  {v}
                </RadioButton>
              ))}
            </Stack>
            <Heading fontSize="2xl" color="gray.500" fontWeight="normal">
              Sweatpants Size
            </Heading>
            <Stack
              direction="row"
              spacing={0}
              {...pantsSizeSelector.getRootProps()}
            >
              {PANTS_SIZES?.map((v) => (
                <RadioButton
                  key={v || 0}
                  {...pantsSizeSelector.getRadioProps({ value: v })}
                >
                  {v}
                </RadioButton>
              ))}
            </Stack>
            <Heading fontSize="2xl" color="gray.500" fontWeight="normal">
              Gloves Size
            </Heading>
            <Stack
              direction="row"
              spacing={4}
              {...glovesSizeSelector.getRootProps()}
            >
              {GLOVES_SIZES?.map((v) => (
                <RadioButton
                  key={v || 0}
                  {...glovesSizeSelector.getRadioProps({ value: v })}
                >
                  {v}
                </RadioButton>
              ))}
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="center" mb={1}>
          {children}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
