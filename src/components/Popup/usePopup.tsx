// Packages
import { use } from 'react';

// Relatives
import PopupContext from './PopupContext';

// Types
import type { PopupContextValue } from './PopupContext';

const usePopup = (): PopupContextValue => {
  const context = use(PopupContext);
  if (!context) {
    throw new Error('PopupContext value is undefined. Make sure you use the PopupProvider before using the hook.');
  }

  return context;
};

export default usePopup;
