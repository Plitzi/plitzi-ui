import { Children, cloneElement, isValidElement, useCallback, useEffect, useId, useMemo, useRef } from 'react';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import ItemContent from './ItemContent';
import ItemHeader from './ItemHeader';
import useAccordion from '../../hooks/useAccordion';

import type { ItemContentProps } from './ItemContent';
import type { ItemHeaderProps } from './ItemHeader';
import type { variantKeys } from '../../Accordion.styles';
import type AccordionStyles from '../../Accordion.styles';
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
  id: idProp,
  children,
  testId: testIdProp = '',
  isOpen: isOpenProp,
  resizable: resizableProp = true,
  intent: intentProp,
  direction = 'column',
  wrap,
  items,
  justify,
  gap = 0,
  grow,
  shrink = 1,
  basis = 0,
  size: sizeProp,
  onClick
}: AccordionItemProps) => {
  const reactId = useId();
  const id = idProp || `accordion-item-${reactId}`;
  const ref = useRef<HTMLDivElement>(undefined) as RefObject<HTMLDivElement>;
  const {
    registeredItems,
    openItems,
    intent,
    size,
    resizable,
    testId,
    isOpen: isOpenFn,
    onResizeStart,
    toggle,
    register,
    unregister
  } = useAccordion();
  const testidFinal = testIdProp || testId;
  const classNameTheme = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: ['item', 'itemDivider'],
    className,
    variants: { intent: intentProp ?? intent, size: sizeProp ?? size }
  });

  useEffect(() => {
    register(id, ref);

    return () => unregister(id);
  }, [id, register, unregister]);

  const isOpen = isOpenProp === undefined ? isOpenFn(id) : isOpenProp;

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      toggle(id);
    },
    [onClick, toggle, id]
  );

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
          testId: testidFinal ? `${testidFinal}-${id}` : undefined,
          onClick: handleClick
        });
      } else if (child.type === ItemContent) {
        const itemContentProps = child.props as ItemContentProps;
        components.content = cloneElement<ItemContentProps>(child as ReactElement<ItemContentProps>, {
          intent,
          size,
          grow: grow ?? isOpen,
          ...itemContentProps,
          testId: testidFinal ? `${testidFinal}-${id}` : undefined
        });
      }
    });

    return components;
  }, [children, intent, size, isOpen, testidFinal, id, handleClick, grow]);

  const canResize = useMemo(() => {
    if (!isOpen || !resizableProp || !resizable) {
      return false;
    }

    const index = registeredItems.findIndex(i => i.id === id);
    if (index === -1 || index === registeredItems.length - 1) {
      return false;
    }

    return (
      openItems.includes(registeredItems[index + 1].id) ||
      registeredItems.find((i, pos) => openItems.includes(i.id) && i.id !== id && pos > index)
    );
  }, [id, isOpen, openItems, registeredItems, resizable, resizableProp]);

  return (
    <Flex
      ref={ref}
      aria-expanded={isOpen}
      testId={testidFinal ? `${testidFinal}-${id}-accordion-item` : undefined}
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
      {canResize && <div className={classNameTheme.itemDivider} onMouseDown={onResizeStart(id)} />}
    </Flex>
  );
};

AccordionItem.Header = ItemHeader;
AccordionItem.Content = ItemContent;

export default AccordionItem;
