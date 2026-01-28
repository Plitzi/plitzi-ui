import { useRef, useState } from 'react';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import AccordionProvider from './AccordionProvider';
import AccordionItem from './components/AccordionItem';

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
  value,
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
  const containerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [openItems, setOpenItems] = useState<string[]>(defaultValue ?? []);

  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'root',
    className,
    variants: { intent, size }
  });

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
      grow={openItems.length > 0 ? grow : false}
    >
      <AccordionProvider
        containerRef={containerRef}
        intent={intent}
        size={size}
        testId={testId}
        multi={multi}
        alwaysOpen={alwaysOpen}
        value={value}
        openItems={openItems}
        setOpenItems={setOpenItems}
        onChange={onChange}
        // containerRef={containerRef}
      >
        {children}
      </AccordionProvider>
    </Flex>
  );
};

Accordion.Item = AccordionItem;
export default Accordion;
