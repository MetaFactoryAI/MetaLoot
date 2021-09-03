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
    <Box overflow="hidden" maxW={500} w="100%" justifySelf="center">
      <Image src={imageUrl} />
      <HStack
        align="center"
        justify="space-between"
        borderWidth={2}
        borderTopWidth={0}
        borderColor={borderColor}
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
