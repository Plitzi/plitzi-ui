// Packages
import { createContext } from 'react';

// Types
import type { PopupPlacement, PopupSettings } from './Popup';
import type { PopupInstance } from './PopupProvider';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupContextValue = {
  popups: PopupInstance[];
  popupIds: string[];
  limitMode?: ContainerDraggableProps['limitMode'];
  addPopup?: (id: string, component: ReactNode, settings?: PopupSettings) => void;
  focusPopup?: (popupId: string, sort?: number) => void;
  placementPopup?: (popupId: string, placement: PopupPlacement) => void;
  existsPopup?: (popupId: string) => boolean;
  removePopup?: (popupId: string) => void;
};

const popupDefaultValue = {
  popups: [],
  popupIds: [],
  limitMode: 'window' as const,
  addPopup: undefined,
  focusPopup: undefined,
  placementPopup: undefined,
  existsPopup: undefined,
  removePopup: undefined
};

const PopupContextFloating = createContext<PopupContextValue | undefined>(popupDefaultValue);

const PopupContextLeft = createContext<PopupContextValue | undefined>(popupDefaultValue);

const PopupContextRight = createContext<PopupContextValue | undefined>(popupDefaultValue);

export { PopupContextFloating, PopupContextLeft, PopupContextRight };
