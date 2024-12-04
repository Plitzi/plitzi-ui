// Packages
import { useMemo } from 'react';

// Relatives
import AccordionContext from './AccordionContext';

// Types
import type { AccordionContextValue } from './AccordionContext';
import type { ReactNode } from 'react';

export type AccordionProviderProps = {
  children: ReactNode;
} & AccordionContextValue;

const AccordionProvider = ({ children, onUnloadItem }: AccordionProviderProps) => {
  const data = useMemo(() => ({ onUnloadItem }), [onUnloadItem]);

  return <AccordionContext.Provider value={data}>{children}</AccordionContext.Provider>;
};

export default AccordionProvider;
