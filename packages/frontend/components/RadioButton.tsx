import { useRadio, UseRadioProps } from '@chakra-ui/radio';
import { Box } from '@chakra-ui/react';
import React from 'react';

type Props = UseRadioProps;

export const RadioButton: React.FC<Props> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        transitionProperty="common"
        transitionDuration="normal"
        cursor="pointer"
        minWidth={12}
        fontSize="lg"
        textAlign="center"
        _checked={{
          bg: 'gray.200',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p={2}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.children}
      </Box>
    </Box>
  );
};
