import { SmallCloseIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

import { useWeb3 } from '@/lib/useWeb3';
import { formatAddressSmall } from '@/lib/addressHelpers';

export const LoginButton: React.FC = () => {
  const { connectWeb3, disconnect, address, isConnected } = useWeb3();

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnect}
        pl={3}
        pr={2}
        variant="outline"
        rightIcon={<SmallCloseIcon />}
      >
        {formatAddressSmall(address)}
      </Button>
    );
  }
  return <Button onClick={connectWeb3}>Connect Wallet</Button>;
};
