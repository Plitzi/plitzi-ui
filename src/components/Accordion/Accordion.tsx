import { useEffect, useMemo, useRef, useState } from 'react';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import { AccordionContext } from './AccordionContext';
import AccordionItem from './components/AccordionItem';
import AccordionManager from './helpers/AccordionManager';

import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { RefObject, ReactNode } from 'react';

export type AccordionProps = {
  children?: ReactNode;
  multi?: boolean;
  alwaysOpen?: boolean;
  defaultValue?: string[];
  value?: string[];
  testId?: string;
  onChange?: (expanded: string[]) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const Accordion = ({
  className,
  children,
  defaultValue,
  // value,
  multi = false,
  alwaysOpen = true,
  testId = '',
  intent,
  direction = 'column',
  wrap,
  items: flexItems,
  justify,
  gap = 0,
  grow,
  size,
  onChange
}: AccordionProps) => {
  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'root',
    className,
    variants: { intent, size }
  });
  const [ready, setReady] = useState(false);
  const [, setRerender] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const accordionManager = useMemo(
    () => new AccordionManager(containerRef, { multi, alwaysOpen, defaultActive: defaultValue }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alwaysOpen, multi]
  );

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setReady(true);

    return accordionManager.onUpdate((timestamp: number) => {
      setRerender(timestamp);
      onChangeRef.current?.(
        accordionManager
          .get()
          .filter(p => p.active)
          .map(p => p.id)
      );
    });
  }, [accordionManager]);

  const contextValue = useMemo(
    () => ({
      accordionManager,
      intent,
      size,
      resizable: accordionManager.get().length > 1,
      testId
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accordionManager, intent, size, testId, accordionManager.lastUpdate]
  );

  return (
    <Flex
      ref={containerRef}
      testId={testId ? `${testId}-accordion` : undefined}
      className={className}
      direction={direction}
      wrap={wrap}
      items={flexItems}
      justify={justify}
      gap={gap}
      grow={accordionManager.getActives().length > 0 ? grow : false}
    >
      {ready && <AccordionContext value={contextValue}>{children}</AccordionContext>}
    </Flex>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;
