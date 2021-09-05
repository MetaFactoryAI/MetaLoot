import { Tag } from '@chakra-ui/react';
import { utils } from 'ethers';
import React from 'react';

import { formatNumberWithLength } from '@/lib/numberHelpers';
import { useAgldBalance } from '@/lib/useContracts';
import { useWeb3 } from '@/lib/useWeb3';

export const TokenBalance: React.FC = () => {
  const { address } = useWeb3();

  const balance = useAgldBalance();

  if (!address) return null;

  return (
    <Tag
      as="a"
      href="https://info.uniswap.org/#/tokens/0x32353a6c91143bfd6c7d363b546e62a9a2489a20"
      target="_blank"
      colorScheme="yellow"
      fontWeight="bold"
      borderRadius={4}
    >
      {utils.commify(formatNumberWithLength(balance))} AGLD
    </Tag>
  );
};
