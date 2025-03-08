import { use } from 'react';

import { PopupContextFloating, PopupContextLeft, PopupContextRight } from './PopupContext';

import type { PopupPlacement } from './Popup';
import type { PopupContextValue } from './PopupContext';

const usePopup = (placement: PopupPlacement): PopupContextValue => {
  let context;
  if (placement === 'left') {
    context = use(PopupContextLeft);
  } else if (placement === 'right') {
    context = use(PopupContextRight);
  } else {
    // Floating
    context = use(PopupContextFloating);
  }

  if (!context) {
    throw new Error('PopupContext value is undefined. Make sure you use the PopupProvider before using the hook.');
  }

  return context;
};

export default usePopup;
