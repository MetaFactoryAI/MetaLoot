import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { theme as defaultTheme } from '@chakra-ui/theme';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  components: {
    Modal: {
      ModalOverlay: {
        baseStyle: {
          backdropFilter: 'blur(6px)',
          // bg: 'blackAlpha.300',
        },
      },
    },

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
          _hover: {
            bg: 'blackAlpha.700',
            _disabled: {
              bg: 'black',
            },
          },
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
  styles: {
    global: {
      '.bn-onboard-custom.bn-onboard-modal': {
        zIndex: 99,
        backdropFilter: 'blur(6px)',
      },
      '.bn-onboard-custom.bn-onboard-modal-content': {
        marginX: '4',
        maxWidth: 'md',
        shadow: 'lg',
      },
      '.bn-onboard-custom.bn-onboard-modal-content.bn-onboard-dark-mode': {
        backgroundColor: 'gray.700',
      },
      '.bn-onboard-custom.bn-onboard-modal-content-header-icon': {
        display: 'none',
      },
      '.bn-onboard-custom.bn-onboard-select-wallet-info': {
        display: 'none',
      },
      'button.bn-onboard-custom.bn-onboard-prepare-button': {
        ...defaultTheme.components.Button.baseStyle,
        borderWidth: 0,
        backgroundColor: 'blackAlpha.200',
        color: 'blue.400',
        borderRadius: 'md',
        fontSize: 'md',
        height: '10',
      },
      'button.bn-onboard-custom.bn-onboard-prepare-button.bn-onboard-dark-mode-link': {
        backgroundColor: 'whiteAlpha.100',
        color: 'blue.400',
      },
      'button.bn-onboard-custom.bn-onboard-icon-button': {
        ...defaultTheme.components.Button.baseStyle,
        borderRadius: 'md',
        transitionProperty: 'var(--chakra-transition-property-common)',
        transitionDuration: 'var(--chakra-transition-duration-normal)',
        width: { base: '100%', md: '52' },
        ':hover': {
          background: 'blackAlpha.200',
          boxShadow: 'none',
        },
      },
      'button.bn-onboard-custom.bn-onboard-icon-button.bn-onboard-dark-mode-background-hover': {
        ':hover': {
          background: 'whiteAlpha.100',
        },
      },
      'button.bn-onboard-custom.bn-onboard-icon-button.bn-onboard-dark-mode-background-hover.bn-onboard-selected-wallet': {
        background: 'whiteAlpha.100',
        ':hover': {
          background: 'whiteAlpha.200',
        },
      },
      'ul.bn-onboard-custom.bn-onboard-modal-select-wallets': {
        marginBottom: '0px !important',
      },
      '.bn-onboard-custom.bn-onboard-modal-content-close': {
        height: '1rem',
        width: '1rem',
        top: '1rem',
        right: '1rem',
        boxSizing: 'content-box',
        borderRadius: 'full',
        padding: '0.5rem',
      },
      '.bn-onboard-custom.bn-onboard-modal-content-close > svg': {
        width: '3',
        height: '3',
      },
      '.bn-onboard-custom.bn-onboard-modal-content-close.bn-onboard-dark-mode-close-background': {
        ':hover': {
          background: 'whiteAlpha.100',
        },
      },
      '.bn-onboard-custom.bn-onboard-select-info-container > button': {
        display: 'none',
      },
    },
  },
});
