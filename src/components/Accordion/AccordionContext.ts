// Packages
import { createContext } from 'react';

// Types
import type { AccordionItemProps } from './AccordionItem';

export type AccordionContextValue = {
  onUnloadItem?: (id: AccordionItemProps['id']) => void;
};

const accordionDefault = {
  onUnloadItem: undefined
};

const AccordionContext = createContext<AccordionContextValue>(accordionDefault);

export default AccordionContext;
