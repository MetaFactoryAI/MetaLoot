import { SmallCloseIcon } from '@chakra-ui/icons';
import { Button, useBreakpointValue } from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import React from 'react';

import { formatAddressSmall } from '@/lib/addressHelpers';

export const LoginButton: React.FC = () => {
  const { connectWallet, disconnectWallet, address, isConnected } = useWallet();
  const size = useBreakpointValue(['sm', 'md']);

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnectWallet}
        pl={[2, 3]}
        pr={[1, 2]}
        h={[8, 10]}
        size={size}
        variant="outline"
        rightIcon={<SmallCloseIcon ml={[-1, 0]} />}
      >
        {formatAddressSmall(address)}
      </Button>
    );
  }
  return (
    <Button size={size} onClick={connectWallet}>
      Connect Wallet
    </Button>
  );
};
