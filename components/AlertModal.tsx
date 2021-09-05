import {
  Button,
  Heading,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
// https://cdn.shopify.com/s/files/1/1204/3352/products/LS_distressedcharcoal_Cover_1024x1024_af5d66ee-e987-45ba-abcd-4b6e722661c4.jpg?v=1625669698
// https://cdn.shopify.com/s/files/1/1204/3352/products/LSCharcoalBack-min.jpg?v=1625669698
export const AlertModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
    <ModalOverlay />
    <ModalContent borderRadius="none">
      <ModalHeader>
        <Heading fontSize="3xl">You need more AGLD to craft this item.</Heading>
      </ModalHeader>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          as="a"
          ml={3}
          variant="primary"
          href="https://app.uniswap.org/#/swap?outputCurrency=0x32353a6c91143bfd6c7d363b546e62a9a2489a20"
          target="_blank"
        >
          Buy AGLD
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
