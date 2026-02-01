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
  minSize?: number;
  maxSize?: number;
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
  minSize,
  maxSize,
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
  const { accordionManager, intent, size, testId } = useAccordion();
  const testidFinal = testIdProp || testId;
  const classNameTheme = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: ['item', 'itemDivider'],
    className,
    variants: { intent: intentProp ?? intent, size: sizeProp ?? size }
  });

  useEffect(() => {
    accordionManager.register(id, ref, { minSize, maxSize });

    return () => accordionManager.unregister(id);
  }, [accordionManager, id, maxSize, minSize]);

  const isOpen = isOpenProp === undefined ? accordionManager.isOpen(id) : isOpenProp;

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      accordionManager.toggle(id);
    },
    [onClick, accordionManager, id]
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

  const canResize = useMemo(
    () => resizableProp && isOpen && accordionManager.canResize(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, isOpen, accordionManager.lastUpdateActive, accordionManager, resizableProp]
  );

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
      {canResize && <div className={classNameTheme.itemDivider} onMouseDown={accordionManager.onResizeStart(id)} />}
    </Flex>
  );
};

AccordionItem.Header = ItemHeader;
AccordionItem.Content = ItemContent;

export default AccordionItem;
