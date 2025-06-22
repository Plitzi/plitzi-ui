import { Children, cloneElement, isValidElement, useMemo } from 'react';

import useTheme from '@hooks/useTheme';

import MenuItem from './MenuItem';

import type { MenuItemProps } from './MenuItem';
import type { MenuListProps } from './MenuList';
import type MenuListStyles from './MenuList.styles';
import type { variantKeys } from './MenuList.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode, RefObject } from 'react';

export type MenuProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  testId?: string;
  onSelect?: MenuListProps['onSelect'];
} & useThemeSharedProps<typeof MenuListStyles, typeof variantKeys>;

const Menu = ({ ref, className, children, testId, onSelect }: MenuProps) => {
  className = useTheme<typeof MenuListStyles, typeof variantKeys>('MenuList', {
    className,
    componentKey: 'menu'
  });

  const { items } = useMemo(() => {
    const components: { items: ReactNode[] } = { items: [] };
    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === MenuItem) {
        const childProps = child.props as MenuItemProps;
        components.items.push(
          cloneElement<MenuItemProps>(child as ReactElement<MenuItemProps>, {
            testId: testId ? `${testId}-${i}` : undefined,
            key: i,
            ...childProps,
            onSelect
          })
        );
      }
    });

    return components;
  }, [children, onSelect, testId]);

  return (
    <div ref={ref} className={className} data-testid={testId}>
      {items}
    </div>
  );
};

export default Menu;
