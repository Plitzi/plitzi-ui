import { createContext } from 'react';

import type PopupManager from './helpers/PopupManager';
import type { PopupSettings } from './Popup';
import type { PopupInstance } from './PopupProvider';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupContextValue = {
  popupManager: InstanceType<typeof PopupManager>;
  popups: PopupInstance[];
  popupIds: string[];
  popupActiveIds: string[];
  limitMode?: ContainerDraggableProps['limitMode'];
  multi: boolean;
  multiExpanded: boolean;
  addPopup: (id: string, component: ReactNode, settings?: PopupSettings) => void;
  existsPopup: (popupId: string) => boolean;
  removePopup: (popupId: string) => void;
};

const popupDefaultValue = {
  popupManager: undefined as unknown as InstanceType<typeof PopupManager>,
  popups: [],
  popupIds: [],
  popupActiveIds: [],
  limitMode: 'window' as const,
  multi: false,
  multiExpanded: false,
  addPopup: () => {},
  existsPopup: () => false,
  removePopup: () => {}
} as PopupContextValue;

const PopupContextFloating = createContext<PopupContextValue>(popupDefaultValue);

const PopupContextLeft = createContext<PopupContextValue>(popupDefaultValue);

const PopupContextRight = createContext<PopupContextValue>(popupDefaultValue);

export { PopupContextFloating, PopupContextLeft, PopupContextRight };
