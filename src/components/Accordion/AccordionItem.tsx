// Packages
import { Children, cloneElement, isValidElement, useContext, useEffect, useMemo } from 'react';

// Alias
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Relatives
import AccordionContext from './AccordionContext';
import ItemContent from './ItemContent';
import ItemHeader from './ItemHeader';

// Types
import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { ItemContentProps } from './ItemContent';
import type { ItemHeaderProps } from './ItemHeader';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode } from 'react';

export type AccordionItemProps = {
  children?: ReactNode;
  id?: string;
  isOpen?: boolean;
  testId?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const AccordionItem = ({
  className,
  id = '',
  children,
  testId = '',
  isOpen = false,
  intent,
  direction = 'column',
  wrap,
  items,
  justify,
  gap = 4,
  grow,
  onClick
}: AccordionItemProps) => {
  const { onUnloadItem } = useContext(AccordionContext);
  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'item',
    className,
    variant: { intent }
  });

  useEffect(() => {
    return () => {
      onUnloadItem?.(id);
    };
  }, [id, onUnloadItem]);

  const { header, content } = useMemo(() => {
    const components: { header: ReactNode; content: ReactNode } = {
      header: undefined,
      content: undefined
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ItemHeader) {
        const itemHeaderProps = child.props as ItemHeaderProps;
        components.header = cloneElement<ItemHeaderProps>(child as ReactElement<ItemHeaderProps>, {
          intent,
          isOpen,
          ...itemHeaderProps,
          testId: testId ? `${testId}-${id}` : undefined,
          onClick
        });
      } else if (child.type === ItemContent) {
        const itemContentProps = child.props as ItemContentProps;
        components.content = cloneElement<ItemHeaderProps>(child as ReactElement<ItemContentProps>, {
          intent,
          ...itemContentProps,
          testId: testId ? `${testId}-${id}` : undefined
        });
      }
    });

    return components;
  }, [children, intent, testId, id, isOpen, onClick]);

  return (
    <Flex
      testId={testId ? `${testId}-${id}-accordion-item` : undefined}
      className={className}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      grow={isOpen ? grow : false}
    >
      {header}
      {isOpen && content}
    </Flex>
  );
};

AccordionItem.Header = ItemHeader;
AccordionItem.Content = ItemContent;

export default AccordionItem;
