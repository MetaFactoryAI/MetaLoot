import { Button, UseNumberInputReturn, VStack } from '@chakra-ui/react';
import React from 'react';

type Props = UseNumberInputReturn & {};

export const AmountSelector: React.FC<Props> = ({
  getDecrementButtonProps,
  getIncrementButtonProps,
  isDisabled,
}) => {
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  return (
    <VStack spacing={0}>
      <Button variant="primary" {...inc} disabled={isDisabled}>
        +
      </Button>
      <Button variant="primary" {...dec} disabled={isDisabled}>
        -
      </Button>
    </VStack>
  );
};
