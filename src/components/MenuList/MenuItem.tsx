import classNames from 'classnames';
import { Children, cloneElement, isValidElement, use, useCallback, useMemo, useRef, useState } from 'react';

import Icon from '@components/Icon';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

import Menu from './Menu';
import MenuListContainer from './MenuListContainer';
import MenuListContext from './MenuListContext';

import type { MenuProps } from './Menu';
import type { MenuListProps } from './MenuList';
import type MenuListStyles from './MenuList.styles';
import type { variantKeys } from './MenuList.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type MenuItemProps = {
  children?: ReactNode;
  testId?: string;
  value?: string;
  onSelect?: MenuListProps['onSelect'];
} & useThemeSharedProps<typeof MenuListStyles, typeof variantKeys>;

type GenericChildProps = Omit<{ [key: string]: unknown }, 'key' | 'testId'> & { key?: number; testId?: string };

const MenuItem = ({ className, children, value, disabled, testId, onSelect }: MenuItemProps) => {
  const classNameTheme = useTheme<typeof MenuListStyles, typeof variantKeys>('MenuList', {
    className,
    componentKey: ['menuItem', 'container', 'icon'],
    variant: { disabled }
  });
  const ref = useRef<HTMLDivElement>(null);
  const menuListContextValue = use(MenuListContext);
  const newMenuListContextValue = useMemo(
    () => ({ ...menuListContextValue, parentMenuRef: ref as RefObject<HTMLDivElement> }),
    [menuListContextValue]
  );
  const [open, setOpen] = useState(false);

  useDidUpdateEffect(() => {
    if (!subMenu) {
      return;
    }

    setOpen(state => {
      if (state && !menuListContextValue.open) {
        return false;
      }

      return state;
    });
  }, [menuListContextValue.open]);

  const { icon, content, subMenu } = useMemo(() => {
    const components: { icon?: ReactNode; content: ReactNode[]; subMenu?: ReactNode } = {
      icon: undefined,
      content: [],
      subMenu: undefined
    };
    Children.forEach(children, (child, i) => {
      if (typeof child === 'string') {
        components.content.push(child);
        return;
      }

      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.icon = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          testId: testId ? `${testId}-icon` : undefined,
          ...childProps,
          intent: 'custom'
        });
      } else if (child.type === Menu) {
        const childProps = child.props as MenuProps;
        components.subMenu = cloneElement<MenuProps>(child as ReactElement<MenuProps>, {
          testId: testId ? `${testId}-menu` : undefined,
          ...childProps,
          onSelect
        });
      } else {
        const childProps = child.props as GenericChildProps;
        components.content.push(
          cloneElement<GenericChildProps>(child as ReactElement<GenericChildProps>, {
            key: i,
            testId: testId ? `${testId}-${i}` : undefined,
            ...childProps
          })
        );
      }
    });

    return components;
  }, [children, onSelect, testId]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }

      if (subMenu) {
        setOpen(state => !state);
      } else {
        onSelect?.(value);
      }
    },
    [disabled, onSelect, subMenu, value]
  );

  return (
    <div
      ref={ref}
      className={classNames(classNameTheme.menuItem, { relative: !!subMenu })}
      data-testid={testId}
      onClick={handleClick}
    >
      {icon}
      <div className="grow">{content}</div>
      {subMenu && (
        <>
          <MenuListContext value={newMenuListContextValue}>
            <MenuListContainer asSubMenu open={open}>
              {subMenu}
            </MenuListContainer>
          </MenuListContext>
          <Icon className={classNameTheme.icon} intent="custom" icon="fa-solid fa-chevron-right" />
        </>
      )}
    </div>
  );
};

export default MenuItem;
