import { Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  loading?: boolean;
  error?: Error;
};
export const LoadingState: React.FC<Props> = ({ error, loading = true }) => (
  <Flex w="100%" h="100%" justify="center" align="center">
    {loading ? <Spinner size="xl" /> : null}
    {error ? <Text color="red.700">ERROR: {error.message}</Text> : null}
  </Flex>
);
