import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { LoadingState } from '@/components/LoadingState';
import { CONFIG } from "@/config";
import { useMetaLootData, useMetaLootReader } from '@/lib/useContracts';


export const MetaLootCard: React.FC = () => {

  const { data } = useMetaLootReader('saleTokenId');

  const { error, loading, nft } = useMetaLootData(data?.toString() || '1')

  const bgColor = useColorModeValue('white', 'gray.800');

  const onMint = () => {
    console.log('Mint!');
  }

  if ((loading || error) && !nft) return  <LoadingState loading={loading} error={error} />

  if (!nft) return null;

  return (
    <Box overflow="hidden" maxW={500} w="100%" justifySelf="center">
      <Image src={nft.image} />
      <HStack
        align="center"
        justify="space-between"
        borderWidth={2}
        borderTopWidth={0}
        borderColor="black"
        p={4}
        bg={bgColor}
      >
        <Box>
          <Stack direction="row" align="baseline" spacing={1}>
            <Text color="gray.500">{CONFIG.itemPrice}</Text>
            <Text color="gray.500">AGLD</Text>
          </Stack>
        </Box>
        <Button
          variant="primary"
          leftIcon={<AddIcon w={3} h={3} mr={0} />}
          onClick={onMint}
        >
          Mint
        </Button>
      </HStack>
    </Box>
  );
};
