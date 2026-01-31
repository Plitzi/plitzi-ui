import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import { AccordionContext } from './AccordionContext';
import { sortRefsByDOMOrder } from './helpers/sortItemsByDOMOrder';
import useResize from './hooks/useResize';

import type { variantKeys } from './Accordion.styles';
import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';

type ThemeAccordion = typeof variantKeys;

export type AccordionProviderProps = {
  children: ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  intent?: ThemeAccordion['intent'][number];
  size?: ThemeAccordion['size'][number];
  testId?: string;
  value?: string[];
  multi?: boolean;
  alwaysOpen?: boolean;
  openItems: string[];
  setOpenItems: Dispatch<SetStateAction<string[]>>;
  onChange?: (expanded: string[]) => void;
};

const AccordionProvider = ({
  children,
  containerRef,
  intent,
  size,
  testId,
  value,
  multi,
  alwaysOpen,
  openItems,
  setOpenItems,
  onChange
}: AccordionProviderProps) => {
  const resizable = openItems.length > 1;
  const [registeredItems, setRegisteredItems] = useState<{ id: string; ref: RefObject<HTMLElement | null> }[]>([]);
  const openItemsRef = useRef<string[]>(openItems);
  // eslint-disable-next-line react-hooks/refs
  openItemsRef.current = openItems;
  const { registerPanel, unregisterPanel, resyncLayout, onResizeStart } = useResize({ containerRef });

  const isOpen = useCallback((id: string) => openItems.includes(id), [openItems]);

  const getIndex = useCallback((id: string) => registeredItems.findIndex(i => i.id === id), [registeredItems]);

  const toggle = useCallback(
    (id: string) => {
      setOpenItems(state => {
        const found = state.includes(id);

        if (alwaysOpen && found && state.length === 1) {
          return state;
        }

        let next: string[];

        if (multi) {
          next = found ? state.filter(i => i !== id) : [...state, id];
        } else {
          next = found ? [] : [id];
        }

        onChange?.(next);

        return next;
      });
    },
    [setOpenItems, alwaysOpen, multi, onChange]
  );

  const register = useCallback(
    (id: string, ref: RefObject<HTMLElement | null>, settings: { minSize?: number; maxSize?: number }) => {
      const item = { id, ref };
      setRegisteredItems(state => {
        if (state.find(i => i.id === id)) {
          return state;
        }

        registerPanel(id, ref.current, { ...settings, frozen: !openItemsRef.current.includes(id) });
        const newState = sortRefsByDOMOrder<typeof item>([...state, item]);

        return newState;
      });
    },
    [registerPanel]
  );

  const unregister = useCallback(
    (id: string) => {
      setRegisteredItems(state => state.filter(i => i.id !== id));
      unregisterPanel(id);
      setOpenItems(state => state.filter(i => i !== id));
    },
    [setOpenItems, unregisterPanel]
  );

  useDidUpdateEffect(() => {
    if (alwaysOpen && !openItems.length && registeredItems.length > 0) {
      setOpenItems([registeredItems[0].id]);
    }
  }, [alwaysOpen, registeredItems.length, setOpenItems]);

  useEffect(() => {
    if (value) {
      setOpenItems(multi ? value : value.slice(0, 1));
    }
  }, [value, multi, setOpenItems]);

  useEffect(() => {
    resyncLayout(openItems);
  }, [openItems, resyncLayout]);

  const contextValue = useMemo(
    () => ({
      registeredItems,
      openItems,
      intent,
      size,
      resizable,
      testId,
      isOpen,
      getIndex,
      onResizeStart,
      toggle,
      register,
      unregister
    }),
    [
      registeredItems,
      openItems,
      intent,
      size,
      resizable,
      testId,
      isOpen,
      getIndex,
      onResizeStart,
      toggle,
      register,
      unregister
    ]
  );

  return <AccordionContext value={contextValue}>{children}</AccordionContext>;
};

export default AccordionProvider;
