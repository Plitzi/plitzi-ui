// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['custom', 'primary'],
  size: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'custom'],
  weight: [
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    'thin',
    'extralight',
    'light',
    'normal',
    'medium',
    'semibold',
    'bold',
    'extrabold',
    'black'
  ]
} as const;

export const STYLES_COMPONENT_NAME = 'Text';

export default {
  root: cva('', {
    variants: {
      intent: {
        primary: 'text-primary-500',
        custom: ''
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: '',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl',
        custom: ''
      },
      weight: {
        100: 'font-thin',
        thin: 'font-thin',
        200: 'font-extralight',
        extralight: 'font-extralight',
        300: 'font-light',
        light: 'font-light',
        400: '', // 'font-normal'
        normal: '',
        500: 'font-medium',
        medium: 'font-medium',
        600: 'font-semibold',
        semibold: 'font-semibold',
        700: 'font-bold',
        bold: 'font-bold',
        800: 'font-extrabold',
        extrabold: 'font-extrabold',
        900: 'font-black',
        black: 'font-black'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'custom',
      size: 'md',
      weight: 400
    }
  })
};
