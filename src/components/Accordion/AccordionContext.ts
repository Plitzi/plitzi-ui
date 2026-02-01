import { createContext } from 'react';

import type { variantKeys } from './Accordion.styles';
import type AccordionManager from './helpers/AccordionManager';

type ThemeAccordion = typeof variantKeys;

export type AccordionContextValue = {
  accordionManager: InstanceType<typeof AccordionManager>;
  intent?: ThemeAccordion['intent'][number];
  size?: ThemeAccordion['size'][number];
  resizable: boolean;
  testId?: string;
};

export const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
