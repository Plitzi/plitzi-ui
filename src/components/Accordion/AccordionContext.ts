import { createContext } from 'react';

import type { AccordionItemProps } from './AccordionItem';
import type { RefObject } from 'react';

export type AccordionContextValue = {
  containerRef?: RefObject<HTMLDivElement | null>;
  onUnloadItem?: (id: Exclude<AccordionItemProps['id'], undefined>) => void;
};

const accordionDefault = {
  itemSelected: [],
  spaceAvailable: { availableWidth: 0, availableHeight: 0 },
  orientation: 'vertical' as const,
  containerRef: undefined,
  onUnloadItem: undefined
};

const AccordionContext = createContext<AccordionContextValue>(accordionDefault);

export default AccordionContext;
