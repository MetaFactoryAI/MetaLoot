import {
  Heading,
  Modal,
  ModalContent,
  ModalFooter, ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProductSelectModal: React.FC<Props> = ({
  // lootBags,
  isOpen,
  onClose,
  children,
}) => {
  const initialRef = useRef<HTMLButtonElement | null>(null);

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
        <ModalHeader>
          <Heading fontSize="3xl">
            Sign message to confirm redemption
          </Heading>
        </ModalHeader>
        <ModalFooter justifyContent="center" mb={1}>
          {children}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
