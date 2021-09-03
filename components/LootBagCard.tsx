import { Box, HStack, Image, Tag, Text } from '@chakra-ui/react';
import React from 'react';

type Props = { imageUrl: string; name: string; synthetic: boolean };

export const LootBagCard: React.FC<Props> = ({ imageUrl, name, synthetic }) => (
  <Box borderWidth="2px" overflow="hidden">
    <Image src={imageUrl} />
    <Box p={4} borderTopWidth={2}>
      <HStack justify="center" align="center">
        <Text fontFamily="mono" fontSize="md">
          {name}
        </Text>
        {synthetic ? <Tag borderRadius="full">Synthetic</Tag> : null}
      </HStack>
    </Box>
  </Box>
);
