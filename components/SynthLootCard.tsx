import { Box, HStack, Image, Tag, Text } from '@chakra-ui/react';
import { providers } from 'ethers';
import React from 'react';

import { useSyntheticLoot } from '../lib/useSyntheticLoot';
import { formatAddressSmall } from '../utils/addressHelpers';

type Props = {
  provider: providers.Web3Provider;
  address: string;
};

export const SynthLootCard: React.FC<Props> = ({ provider, address }) => {
  const synthData = useSyntheticLoot(provider, address);

  if (!synthData) return null;

  return (
    <Box borderWidth="2px" overflow="hidden" maxW="md">
      <Image src={synthData.image} />
      <Box p={4} borderTopWidth={2}>
        <HStack justify="center" align="center">
          <Text fontFamily="mono" fontSize="md">
            Bag {formatAddressSmall(address)}
          </Text>
          <Tag borderRadius="full">Synthetic</Tag>
        </HStack>
      </Box>
    </Box>
  );
};
