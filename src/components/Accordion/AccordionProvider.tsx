import { useMemo } from 'react';

// Relatives
import AccordionContext from './AccordionContext';

import type { AccordionContextValue } from './AccordionContext';
import type { ReactNode } from 'react';

export type AccordionProviderProps = {
  children: ReactNode;
} & AccordionContextValue;

const AccordionProvider = ({ children, containerRef, onUnloadItem }: AccordionProviderProps) => {
  const data = useMemo(() => ({ containerRef, onUnloadItem }), [containerRef, onUnloadItem]);

  return <AccordionContext.Provider value={data}>{children}</AccordionContext.Provider>;
};

export default AccordionProvider;
