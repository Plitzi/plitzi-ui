// Packages
import { createContext } from 'react';

// Types
import type { PopupPlacement, PopupSettings } from './Popup';
import type { PopupInstance } from './PopupProvider';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupContextValue = {
  popupLeft: PopupInstance[];
  popupRight: PopupInstance[];
  popupFloating: PopupInstance[];
  limitMode?: ContainerDraggableProps['limitMode'];
  addPopup?: (id: string, component: ReactNode, settings?: PopupSettings) => void;
  focusPopup?: (popupId: string, sort?: number) => void;
  placementPopup?: (popupId: string, placement: PopupPlacement) => void;
  existsPopup?: (popupId: string) => boolean;
  removePopup?: (popupId: string) => void;
};

const popupDefaultValue = {
  popupLeft: [],
  popupRight: [],
  popupFloating: [],
  limitMode: 'window' as const,
  addPopup: undefined,
  focusPopup: undefined,
  placementPopup: undefined,
  existsPopup: undefined,
  removePopup: undefined
};

const PopupContext = createContext<PopupContextValue | undefined>(popupDefaultValue);

export default PopupContext;
