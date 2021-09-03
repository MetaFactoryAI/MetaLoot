import { SmallCloseIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { useWeb3 } from '../lib/hooks';
import { formatAddressSmall } from '../utils/addressHelpers';

export const LoginButton: React.FC = () => {
  const { connectWeb3, disconnect, address, isConnected } = useWeb3();

  const handleLoginClick = useCallback(async () => {
    await connectWeb3();
  }, [connectWeb3]);

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnect}
        variant="outline"
        rightIcon={<SmallCloseIcon />}
      >
        {formatAddressSmall(address)}
      </Button>
    );
  }
  return <Button onClick={handleLoginClick}>Connect</Button>;
};
