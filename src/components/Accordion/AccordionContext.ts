import { createContext } from 'react';

import type { variantKeys } from './Accordion.styles';
import type { MouseEvent, RefObject } from 'react';

type ThemeAccordion = typeof variantKeys;

export type AccordionContextValue = {
  registeredItems: { id: string; ref: RefObject<HTMLElement | null> }[];
  openItems: string[];
  intent?: ThemeAccordion['intent'][number];
  size?: ThemeAccordion['size'][number];
  resizable: boolean;
  testId?: string;
  isOpen: (id: string) => boolean;
  getIndex: (id: string) => number;
  onResizeStart: (id: string) => (e: MouseEvent) => void;
  toggle: (id: string) => void;
  register: (id: string, ref: RefObject<HTMLElement | null>, settings: { minSize?: number; maxSize?: number }) => void;
  unregister: (id: string) => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(null);
