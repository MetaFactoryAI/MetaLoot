import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: '"EB Garamond", serif',
  },
  colors: {
    gray: {
      '50': '#F2F2F2',
      '100': '#DBDBDB',
      '200': '#C4C4C4',
      '300': '#ADADAD',
      '400': '#969696',
      '500': '#808080',
      '600': '#666666',
      '700': '#4D4D4D',
      '800': '#1A1A1A',
      '900': '#0d0d0d',
    },
  },
});
