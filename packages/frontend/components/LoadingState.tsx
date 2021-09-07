import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

type Props = {
  loading?: boolean;
};
export const LoadingState: React.FC<Props> = ({ loading = true }) => (
  <Flex w="100%" h="100%" justify="center" align="center">
    {loading ? <Spinner size="xl" /> : null}
  </Flex>
);
