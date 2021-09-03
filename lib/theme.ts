import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'none',
        fontWeight: 'normal',
      },
    },
  },
  fonts: {
    heading: '"EB Garamond", serif',
    mono: 'Jetbrains Mono, monospace',
    body: 'Jetbrains Mono, monospace',
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
      '700': '#333333',
      '800': '#212121',
      '900': '#0d0d0d',
    },
  },
});
