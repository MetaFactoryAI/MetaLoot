import { createIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import { CONFIG } from '@/config';

const AddIcon = createIcon({
  displayName: 'AddIcon',
  viewBox: '0 0 95 95',
  d:
    'M52.5,0 L52.5,41.5 L95,41.5 L95,53.5 L52.5,53.5 L52.5,95 L40.5,95 L40.5,53.499 L0,53.5 L0,41.5 L40.5,41.499 L40.5,0 L52.5,0 Z',
});

type Props = {
  imageUrl: string;
  name: string;
  synthetic: boolean;
  isInCart: boolean;
  onCraft: () => void;
  onRemove: () => void;
};

export const LootBagCard = React.memo<Props>(
  ({ imageUrl, name, synthetic, isInCart, onCraft, onRemove }) => (
      <Box overflow="hidden" maxW={500} w="100%" justifySelf="center">
        <Image src={imageUrl} />
        <HStack
          align="center"
          justify="space-between"
          borderWidth={2}
          borderTopWidth={0}
          borderColor='black'
          p={4}
          bg={useColorModeValue('white', 'gray.800')}
        >
          <Box>
            <Text fontSize="base" fontWeight="bold">
              {synthetic ? 'Synthetic Bag' : name}
            </Text>
            <Stack direction="row" align="baseline" spacing={1}>
              <Text color="gray.500">{CONFIG.itemPrice}</Text>
              <Text color="gray.500">AGLD</Text>
            </Stack>
          </Box>
          {isInCart ? (
            <IconButton
              variant="outline"
              aria-label="Remove From Cart"
              onClick={onRemove}
              icon={<DeleteIcon />}
            />
          ) : (
            <Button
              variant="primary"
              leftIcon={<AddIcon w={3} h={3} mr={0} />}
              onClick={onCraft}
            >
              Craft
            </Button>
          )}
        </HStack>
      </Box>
    ),
);
