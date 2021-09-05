import { SmallCloseIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

import { formatAddressSmall } from '@/lib/addressHelpers';
import { useWeb3 } from '@/lib/useWeb3';

export const LoginButton: React.FC = () => {
  const { connectWeb3, disconnect, address, isConnected } = useWeb3();

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnect}
        pl={[2, 3]}
        pr={[1, 2]}
        h={[8, 10]}
        variant="outline"
        rightIcon={<SmallCloseIcon />}
      >
        {formatAddressSmall(address)}
      </Button>
    );
  }
  return <Button onClick={connectWeb3}>Connect Wallet</Button>;
};
