import { Button, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { AccountModal } from '@meta-cred/ui/dist/AccountModal';
import { useWallet } from '@meta-cred/usewallet';
import React from 'react';

import { formatAddress, formatAddressSmall } from '@/lib/addressHelpers';

export const LoginButton: React.FC = () => {
  const {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    ens,
    wallet,
  } = useWallet();
  const size = useBreakpointValue(['sm', 'md']);
  const formatFn =
    useBreakpointValue([formatAddressSmall, null, formatAddress]) ||
    formatAddress;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const displayName = ens?.name || formatFn(address || undefined);

  const onClick = () => {
    if (address) onOpen();
    else connectWallet();
  };

  const onDisconnect = () => {
    disconnectWallet();
    connectWallet();
  };

  if (isConnected && address) {
    return (
      <>
        <Button onClick={onClick} px={[2, 3]} size={size} variant="outline">
          {displayName}
        </Button>
        <AccountModal
          onClose={onClose}
          connectedWallet={wallet?.name}
          isOpen={isOpen}
          address={address}
          onDisconnect={onDisconnect}
        />
      </>
    );
  }
  return (
    <Button size={size} onClick={connectWallet}>
      Connect Wallet
    </Button>
  );
};
