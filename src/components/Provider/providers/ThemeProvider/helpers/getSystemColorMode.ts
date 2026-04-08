import type { ColorMode } from '../ThemeProvider';

const getSystemColorMode = (): ColorMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export default getSystemColorMode;
