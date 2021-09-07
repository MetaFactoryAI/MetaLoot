import { SmallCloseIcon } from '@chakra-ui/icons';
import { Button, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import { formatAddressSmall } from '@/lib/addressHelpers';
import { useWeb3 } from '@/lib/useWeb3';

export const LoginButton: React.FC = () => {
  const { connectWeb3, disconnect, address, isConnected } = useWeb3();
  const size = useBreakpointValue(['sm', 'md']);

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnect}
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
    <Button size={size} onClick={connectWeb3}>
      Connect Wallet
    </Button>
  );
};
