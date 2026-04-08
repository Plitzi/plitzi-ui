import getSystemColorMode from './getSystemColorMode';

import type { ColorMode, ColorModeDefaultValue } from '../ThemeProvider';

const resolveInitialColorMode = (storageKey: string | undefined, defaultMode: ColorModeDefaultValue): ColorMode => {
  if (storageKey && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // ignore
    }
  }

  return defaultMode === 'system' ? getSystemColorMode() : defaultMode;
};

export default resolveInitialColorMode;
