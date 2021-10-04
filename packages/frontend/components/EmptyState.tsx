import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';

type Props = {
  title: string;
};
export const EmptyState: React.FC<Props> = ({ title }) => (
  <Flex w="100%" h="100%" justify="center" align="center">
    <Heading my="20" color="gray.300" textAlign="center">
      {title}
    </Heading>
  </Flex>
);
