// Packages
import { Children, cloneElement, isValidElement, useCallback, useEffect, useMemo, useState } from 'react';

// Alias
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Relatives
import AccordionItem from './AccordionItem';
import AccordionProvider from './AccordionProvider';

// Types
import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { AccordionItemProps } from './AccordionItem';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode } from 'react';

export type AccordionProps = {
  children?: ReactNode;
  multi?: boolean;
  defaultIndex?: AccordionItemProps['id'][];
  index?: AccordionItemProps['id'][];
  testId?: string;
  onChange?: (expandedIndex: AccordionItemProps['id'][]) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const emptyArray = [] as AccordionItemProps['id'][];

const Accordion = ({
  className,
  children,
  defaultIndex = emptyArray,
  index = emptyArray,
  multi = false,
  testId = '',
  intent,
  direction = 'column',
  wrap,
  items: flexItems,
  justify,
  gap = 4,
  grow,
  onChange
}: AccordionProps) => {
  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'root',
    className,
    variant: { intent }
  });
  const [itemSelected, setItemSelected] = useState<AccordionItemProps['id'][]>(() =>
    multi ? defaultIndex : index.slice(0, 1)
  );

  const handleUnloadItem = useCallback((id: AccordionItemProps['id']) => {
    setItemSelected(state => {
      if (state.includes(id)) {
        return state.filter(item => item !== id);
      }

      return state;
    });
  }, []);

  const handleClick = useCallback(
    (index: AccordionItemProps['id'], onClick?: AccordionItemProps['onClick']) => (e: MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(e);
      }

      setItemSelected(state => {
        const found = state.includes(index);
        let newState = state;
        if (multi && !found) {
          newState = [...state, index];
        } else if (multi) {
          newState = state.filter(item => item !== index);
        } else if (found) {
          newState = [];
        } else {
          newState = [index];
        }

        onChange?.(newState);

        return newState;
      });
    },
    [multi, onChange]
  );

  useEffect(() => {
    if (!multi && index.length === 0) {
      setItemSelected(state => (state.length > 0 ? state.slice(0, 1) : []));
    } else if (!multi && index.length > 0) {
      setItemSelected(index.slice(0, 1));
    } else if (index.length > 0) {
      setItemSelected(index);
    }
  }, [multi, index]);

  const { items } = useMemo(() => {
    const components: { items: ReactNode[] } = {
      items: []
    };

    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === AccordionItem) {
        const accordionItemProps = child.props as AccordionItemProps;
        const itemId = accordionItemProps.id ?? i.toString();
        components.items.push(
          cloneElement<AccordionItemProps>(child as ReactElement<AccordionItemProps>, {
            intent,
            key: i,
            grow,
            ...accordionItemProps,
            testId,
            id: itemId,
            isOpen: itemSelected.includes(itemId),
            onClick: handleClick(itemId, accordionItemProps.onClick)
          })
        );
      }
    });

    return components;
  }, [children, testId, intent, itemSelected, grow, handleClick]);

  return (
    <Flex
      testId={testId ? `${testId}-accordion` : undefined}
      className={className}
      direction={direction}
      wrap={wrap}
      items={flexItems}
      justify={justify}
      gap={gap}
      grow={itemSelected.length > 0 ? grow : false}
    >
      <AccordionProvider onUnloadItem={handleUnloadItem}>{items}</AccordionProvider>
    </Flex>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;
