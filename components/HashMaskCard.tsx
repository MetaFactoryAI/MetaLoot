import { Badge, Box, HStack, Image } from '@chakra-ui/react';
import { OpenSeaAsset } from 'opensea-js/lib/types';
import React from 'react';

type Props = { mask: OpenSeaAsset };
export const HashMaskCard: React.FC<Props> = ({ mask }) => (
  <Box
    maxW="sm"
    alignSelf="center"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
  >
    <Image src={mask.imageUrlOriginal} alt={`HashMask #${mask.tokenId}`} />

    <Box p={4}>
      <HStack justify="center" align="center">
        <Box
          fontFamily="mono"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {mask.name ? `"${mask.name}"` : 'Unnamed'}
        </Box>
        <Badge borderRadius="full" px="2">
          #{mask.tokenId}
        </Badge>
      </HStack>
    </Box>
  </Box>
);
