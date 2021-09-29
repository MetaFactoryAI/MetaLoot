import { Tag, useBreakpointValue } from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { utils } from 'ethers';
import React from 'react';

import { formatNumberWithLength } from '@/lib/numberHelpers';
import { useAgldBalance } from '@/lib/useContracts';

export const TokenBalance: React.FC = () => {
  const { address } = useWallet();

  const balance = useAgldBalance();

  const size = useBreakpointValue(['sm', 'md']);
  if (!address) return null;

  return (
    <Tag
      as='a'
      href='https://info.uniswap.org/#/tokens/0x32353a6c91143bfd6c7d363b546e62a9a2489a20'
      target='_blank'
      colorScheme='yellow'
      fontWeight='bold'
      textAlign='center'
      borderRadius={4}
      py={[1, 'initial']}
      size={size}
      maxW={[16, 'initial']}
    >
      {`${utils.commify(formatNumberWithLength(balance))} AGLD`}
    </Tag>
  );
};
