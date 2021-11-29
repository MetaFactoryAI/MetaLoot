import { Box, Flex, Slide } from '@chakra-ui/react';
import React from 'react';


type Props = {
  isOpen: boolean;
};

export const BottomBar: React.FC<Props> = ({ isOpen, children }) => (
  <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
    <Flex
      shadow={isOpen ? 'light-lg' : 'none'}
      bg="black"
      m={[0, 0, 4]}
      p={[5, 5, 6]}
      justify="space-between"
      align="center"
    >
      <Box>{children}</Box>
    </Flex>
  </Slide>
);
