import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Slide } from '@chakra-ui/react';
import React from 'react';

type Props = {
  isOpen: boolean;
};

export const BottomBar: React.FC<Props> = ({ isOpen, children }) => (
  <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
    <Flex
      shadow="light-lg"
      bg="black"
      m={[0, 0, 4]}
      p={[6, 6, 8]}
      justify="space-between"
      align="center"
    >
      <Box>{children}</Box>
      <Button
        rightIcon={<ArrowForwardIcon />}
        variant="inverted"
        size="lg"
        justifySelf="flex-end"
      >
        Checkout
      </Button>
    </Flex>
  </Slide>
);