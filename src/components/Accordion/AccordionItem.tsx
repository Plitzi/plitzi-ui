import { Children, cloneElement, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import AccordionContext from './AccordionContext';
import ItemContent from './ItemContent';
import ItemHeader from './ItemHeader';

import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { ItemContentProps } from './ItemContent';
import type { ItemHeaderProps } from './ItemHeader';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type AccordionItemProps = {
  children?: ReactNode;
  id?: string;
  isOpen?: boolean;
  resizable?: boolean;
  testId?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const AccordionItem = ({
  className,
  id = '',
  children,
  testId = '',
  isOpen = false,
  resizable = true,
  intent,
  direction = 'column',
  wrap,
  items,
  justify,
  gap = 0,
  grow,
  shrink = 0,
  basis = 0,
  size,
  onClick
}: AccordionItemProps) => {
  const ref = useRef<HTMLDivElement>(undefined) as RefObject<HTMLDivElement>;
  const { onUnloadItem } = useContext(AccordionContext);
  const classNameTheme = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: ['item', 'itemDivider'],
    className,
    variants: { intent, size }
  });

  useEffect(() => {
    return () => {
      onUnloadItem?.(id);
    };
  }, [id, onUnloadItem]);

  const { header, content } = useMemo(() => {
    const components: { header: ReactNode; content: ReactNode } = { header: undefined, content: undefined };
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ItemHeader) {
        const itemHeaderProps = child.props as ItemHeaderProps;
        components.header = cloneElement<ItemHeaderProps>(child as ReactElement<ItemHeaderProps>, {
          intent,
          size,
          isOpen,
          ...itemHeaderProps,
          testId: testId ? `${testId}-${id}` : undefined,
          onClick
        });
      } else if (child.type === ItemContent) {
        const itemContentProps = child.props as ItemContentProps;
        components.content = cloneElement<ItemContentProps>(child as ReactElement<ItemContentProps>, {
          intent,
          size,
          grow: grow ?? isOpen,
          ...itemContentProps,
          testId: testId ? `${testId}-${id}` : undefined
        });
      }
    });

    return components;
  }, [children, intent, size, isOpen, testId, id, onClick, grow]);

  useEffect(() => {
    if (!isOpen && ref.current.style.flexBasis) {
      ref.current.style.flexBasis = '';
    }
  }, [isOpen]);

  return (
    <Flex
      ref={ref}
      aria-expanded={isOpen}
      testId={testId ? `${testId}-${id}-accordion-item` : undefined}
      className={classNameTheme.item}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      shrink={shrink}
      basis={basis}
      grow={isOpen}
    >
      {header}
      {isOpen && content}
      {isOpen && resizable && <div className={classNameTheme.itemDivider} />}
    </Flex>
  );
};

AccordionItem.Header = ItemHeader;
AccordionItem.Content = ItemContent;

export default AccordionItem;
