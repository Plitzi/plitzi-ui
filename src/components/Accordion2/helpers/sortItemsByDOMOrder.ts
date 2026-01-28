import type { RefObject } from 'react';

const sortItemsByDOMOrder = <T>(items: (T & { id: string; el: HTMLElement | null })[]): T[] => {
  return items.slice().sort((a, b) => {
    if (a.el === b.el || !a.el || !b.el) {
      return 0;
    }

    return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
};

export const sortRefsByDOMOrder = <T>(items: (T & { id: string; ref: RefObject<HTMLElement | null> })[]): T[] => {
  return items.slice().sort((a, b) => {
    if (a.ref.current === b.ref.current || !a.ref.current || !b.ref.current) {
      return 0;
    }

    return a.ref.current.compareDocumentPosition(b.ref.current) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
};

export default sortItemsByDOMOrder;
