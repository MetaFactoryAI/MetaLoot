import { createIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const AddIcon = createIcon({
  displayName: 'AddIcon',
  viewBox: '0 0 95 95',
  d: 'M52.5,0 L52.5,41.5 L95,41.5 L95,53.5 L52.5,53.5 L52.5,95 L40.5,95 L40.5,53.499 L0,53.5 L0,41.5 L40.5,41.499 L40.5,0 L52.5,0 Z',
});

type Props = {
  imageUrl: string;
  name: string;
  isInCart?: boolean;
  onCraft: () => void;
  onRemove?: () => void;
};

export const LootBagCard = React.memo<Props>(
  ({ imageUrl, name, onCraft }) => (
    <Box overflow="hidden" maxW={500} justifySelf="center">
      <Image src={imageUrl} w="100%" />
      <Stack
        align="flex-start"
        // justify="space-between"
        borderWidth={2}
        borderTopWidth={0}
        borderColor="black"
        p={4}
        spacing={3}
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Box>
          <Text fontSize="base" fontWeight="bold">
            {name}
          </Text>
        </Box>
        <Button
          mt={4}
          variant="primary"
          leftIcon={<AddIcon w={3} h={3} mr={0} />}
          onClick={onCraft}
        >
          Redeem
        </Button>
      </Stack>
    </Box>
  ),
);
