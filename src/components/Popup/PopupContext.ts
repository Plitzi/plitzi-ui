import { createContext } from 'react';

import type { PopupPlacement, PopupSettings } from './Popup';
import type { PopupInstance } from './PopupProvider';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupContextValue = {
  popups: PopupInstance[];
  popupIds: string[];
  popupActiveIds: string[];
  limitMode?: ContainerDraggableProps['limitMode'];
  addPopup: (id: string, component: ReactNode, settings?: PopupSettings) => void;
  focusPopup: (popupId: string, sort?: number) => void;
  placementPopup: (popupId: string, placement: PopupPlacement) => void;
  existsPopup: (popupId: string) => boolean;
  removePopup: (popupId: string) => void;
};

const popupDefaultValue = {
  popups: [],
  popupIds: [],
  popupActiveIds: [],
  limitMode: 'window' as const,
  addPopup: () => {},
  focusPopup: () => {},
  placementPopup: () => {},
  existsPopup: () => false,
  removePopup: () => {}
} as PopupContextValue;

const PopupContextFloating = createContext<PopupContextValue>(popupDefaultValue);

const PopupContextLeft = createContext<PopupContextValue>(popupDefaultValue);

const PopupContextRight = createContext<PopupContextValue>(popupDefaultValue);

export { PopupContextFloating, PopupContextLeft, PopupContextRight };
