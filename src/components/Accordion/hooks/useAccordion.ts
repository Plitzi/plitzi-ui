import { use } from 'react';

import { AccordionContext } from '../AccordionContext';

export const useAccordion = () => {
  const ctx = use(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion components must be used inside <Accordion>');
  }

  return ctx;
};

export default useAccordion;
