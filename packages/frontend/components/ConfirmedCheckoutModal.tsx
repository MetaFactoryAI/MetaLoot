import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl: string | undefined;
  checkoutCompleteUrl: string | undefined;
};

export const ConfirmedCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  checkoutUrl,
  checkoutCompleteUrl,
}) => (
  <Modal
    isCentered
    isOpen={isOpen}
    onClose={onClose}
    size="sm"
    closeOnEsc={false}
    closeOnOverlayClick={Boolean(checkoutCompleteUrl)}
  >
    <ModalOverlay />
    <ModalContent borderRadius="none">
      <ModalHeader>
        <Heading fontSize="3xl">
          {checkoutCompleteUrl
            ? 'Enjoy your Swaps Tee'
            : 'Confirm shipping details to place your order'}
        </Heading>
      </ModalHeader>

      <ModalFooter>
        {checkoutCompleteUrl ? (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        ) : (
          <Spinner mr="4" />
        )}
        <Button
          as="a"
          ml={3}
          variant="primary"
          href={checkoutCompleteUrl || checkoutUrl}
          target="_blank"
          rightIcon={<ExternalLinkIcon />}
        >
          {checkoutCompleteUrl ? 'Order Details' : 'Checkout'}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
