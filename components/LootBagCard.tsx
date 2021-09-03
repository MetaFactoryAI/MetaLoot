import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

type Props = { imageUrl: string; name: string; synthetic: boolean };

export const LootBagCard: React.FC<Props> = ({ imageUrl, name, synthetic }) => {
  const borderColor = useColorModeValue('black', 'black');

  return (
    <Box borderWidth="2px" borderColor={borderColor} overflow="hidden">
      <Image src={imageUrl} />
      <HStack
        align="center"
        justify="space-between"
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Box>
          <Text fontFamily="mono" fontSize="md">
            {synthetic ? 'Synthetic Bag' : name}
          </Text>
        </Box>
        <Button
          borderRadius={0}
          bg="black"
          color="white"
          _hover={{ bg: 'blackAlpha.700' }}
          rightIcon={<ArrowForwardIcon />}
        >
          Forge
        </Button>
      </HStack>
    </Box>
  );
};
