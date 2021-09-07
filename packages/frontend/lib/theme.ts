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
      variants: {
        outline: {
          borderWidth: 2,
          borderColor: 'currentColor',
        },
        primary: {
          bg: 'black',
          color: 'white',
          _hover: { bg: 'blackAlpha.700' },
        },
        inverted: {
          bg: 'white',
          color: 'black',
          _hover: { bg: 'whiteAlpha.700' },
        },
      },
    },
  },
  shadows: {
    bottomBar:
      'rgba(155, 155, 155, 0.1) 0px 0px 0px 1px, rgba(155, 155, 155, 0.2) 0px 5px 5px, rgba(155, 155, 155, 0.4) 0px 10px 10px',
    'light-lg':
      'rgba(100,100,100, 0.1) 0px 0px 0px 0px, rgba(255,255,255, 0.3) 0px 3px 15px, rgba(0,0,0,0.4) 0px 3px 15px',
  },
  radii: {
    base: '0',
    sm: '0',
    md: '0',
  },
  fonts: {
    heading: '"EB Garamond", serif',
    mono: 'Jetbrains Mono, monospace',
    body: 'Jetbrains Mono, monospace',
  },
  colors: {
    yellow: {
      '50': '#F9F5EB',
      '100': '#EFE2C7',
      '200': '#E5CFA3',
      '300': '#DBBC7F',
      '400': '#D1A95C',
      '500': '#C79738',
      '600': '#9F792D',
      '700': '#785A21',
      '800': '#503C16',
      '900': '#281E0B',
    },
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
