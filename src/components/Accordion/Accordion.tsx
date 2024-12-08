// Packages
import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Alias
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Relatives
import AccordionItem from './AccordionItem';
import AccordionProvider from './AccordionProvider';
import useResize from './useResize';

// Types
import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { AccordionItemProps } from './AccordionItem';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode } from 'react';

type AccordionItemId = Exclude<AccordionItemProps['id'], undefined>;

export type AccordionProps = {
  children?: ReactNode;
  multi?: boolean;
  alwaysOpen?: boolean;
  defaultValue?: AccordionItemId[];
  value?: AccordionItemId[];
  testId?: string;
  onChange?: (expandedIndex: AccordionItemId[]) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const emptyArray = [] as AccordionItemId[];

const Accordion = ({
  className,
  children,
  defaultValue = emptyArray,
  value = emptyArray,
  multi = false,
  alwaysOpen = true,
  testId = '',
  intent,
  direction = 'column',
  wrap,
  items: flexItems,
  justify,
  gap = 4,
  grow,
  size,
  onChange
}: AccordionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemSelected, setItemSelected] = useState<AccordionItemId[]>(() => {
    const items = value.length > 0 ? value : defaultValue;
    if (multi) {
      return items;
    }

    if (items.length > 0) {
      return items.slice(0, 1);
    }

    return [];
  });

  const handleUnloadItem = useCallback((id: AccordionItemId) => {
    setItemSelected(state => {
      if (state.includes(id)) {
        return state.filter(item => item !== id);
      }

      return state;
    });
  }, []);

  const handleClick = useCallback(
    (index: AccordionItemId, onClick?: AccordionItemProps['onClick']) => (e: MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(e);
      }

      setItemSelected(state => {
        const found = state.includes(index);
        if (alwaysOpen && state.length === 1 && found) {
          return state;
        }

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
    [multi, alwaysOpen, onChange]
  );

  useEffect(() => {
    if (!multi && value.length === 0) {
      setItemSelected(state => (state.length > 0 ? state.slice(0, 1) : []));
    } else if (!multi && value.length > 0) {
      setItemSelected(value.slice(0, 1));
    } else if (value.length > 0) {
      setItemSelected(value);
    }
  }, [multi, value]);

  const { items } = useMemo(() => {
    const components: { items: ReactElement<AccordionItemProps>[] } = {
      items: []
    };

    const childrenFiltered = Children.toArray(children)
      .filter(child => isValidElement(child) && child.type === AccordionItem)
      .map(child => child as ReactElement<AccordionItemProps>);

    childrenFiltered.forEach((child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === AccordionItem) {
        const accordionItemProps = child.props;
        const itemId = accordionItemProps.id ?? i.toString();
        const nextItemId = !!childrenFiltered[i + 1] && (childrenFiltered[i + 1].props.id ?? `${i + 1}`);
        components.items.push(
          cloneElement<AccordionItemProps>(child, {
            intent,
            size,
            key: itemId,
            ...accordionItemProps,
            resizable: i !== childrenFiltered.length - 1 && itemSelected.includes(nextItemId),
            testId,
            id: itemId,
            isOpen: itemSelected.includes(itemId),
            onClick: handleClick(itemId, accordionItemProps.onClick)
          })
        );
      }
    });

    return components;
  }, [children, testId, intent, itemSelected, size, handleClick]);
  const panels = useMemo(
    () => items.map(item => ({ size: item.props.isOpen ? 100 : 29, minSize: item.props.isOpen ? 100 : 29 })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, itemSelected]
  );
  const [, , resizing] = useResize({ panels, containerRef });

  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'root',
    className,
    variant: { intent, size, resizing }
  });

  useEffect(() => {
    if (alwaysOpen && items.length > 0 && !items.find(item => item.props.isOpen) && items[0].props.id) {
      const itemsSelected = [items[0].props.id];
      setItemSelected(itemsSelected);
      onChange?.(itemsSelected);
    }
  }, [alwaysOpen, items, onChange]);

  return (
    <Flex
      ref={containerRef}
      testId={testId ? `${testId}-accordion` : undefined}
      className={classNames(className, { 'accordion-resizing': resizing })}
      direction={direction}
      wrap={wrap}
      items={flexItems}
      justify={justify}
      gap={gap}
      grow={itemSelected.length > 0 ? grow : false}
    >
      <AccordionProvider containerRef={containerRef} onUnloadItem={handleUnloadItem}>
        {items}
      </AccordionProvider>
    </Flex>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;
