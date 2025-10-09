/* eslint-disable react-hooks/refs */
import {
  Children,
  isValidElement,
  useMemo,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  cloneElement,
  useEffect
} from 'react';

import Icon from '@components/Icon';

import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuListContainer from './MenuListContainer';
import MenuListContext from './MenuListContext';
import MenuListTrigger from './MenuListTrigger';

import type { MenuProps } from './Menu';
import type MenuListStyles from './MenuList.styles';
import type { variantKeys } from './MenuList.styles';
import type { MenuListContextValue } from './MenuListContext';
import type { MenuListTriggerProps } from './MenuListTrigger';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode, RefObject } from 'react';

export type MenuListProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  open?: boolean;
  testId?: string;
  container?: Element | DocumentFragment;
  onSelect?: (value?: string) => void;
} & useThemeSharedProps<typeof MenuListStyles, typeof variantKeys>;

const MenuList = ({
  ref,
  className,
  children,
  open: openProp,
  disabled = false,
  testId,
  placement,
  container,
  onSelect
}: MenuListProps) => {
  const [open, setOpen] = useState(openProp ?? false);
  const triggerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => triggerRef.current, []);

  const handleClickTrigger = useCallback(
    () => !disabled && openProp === undefined && setOpen(state => !state),
    [disabled, openProp]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!open || !triggerRef.current || openProp !== undefined) {
        return;
      }

      if (!triggerRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('.menu')) {
        setOpen(false);
      }
    },
    [open, openProp]
  );

  const handleSelect = useCallback(
    (value?: string) => {
      onSelect?.(value);
      if (openProp === undefined) {
        setOpen(false);
      }
    },
    [onSelect, openProp]
  );

  const { trigger, menu } = useMemo(() => {
    const components: { trigger?: ReactNode; menu?: ReactNode } = {};
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === MenuListTrigger) {
        const childProps = child.props as MenuListTriggerProps;
        components.trigger = cloneElement<MenuListTriggerProps>(child as ReactElement<MenuListTriggerProps>, {
          testId: testId ? `${testId}-trigger` : undefined,
          ...childProps,
          ref: triggerRef as RefObject<HTMLDivElement>,
          onClick: handleClickTrigger
        });
      } else if (child.type === Menu) {
        const childProps = child.props as MenuProps;
        components.menu = cloneElement<MenuProps>(child as ReactElement<MenuProps>, {
          testId: testId ? `${testId}-menu` : undefined,
          ...childProps,
          onSelect: handleSelect
        });
      }
    });

    return components;
  }, [children, handleClickTrigger, handleSelect, testId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, open]);

  const menuListContextValue = useMemo<MenuListContextValue>(
    () => ({
      open,
      placement,
      triggerRef: triggerRef as RefObject<HTMLDivElement>,
      container
    }),
    [open, placement, container]
  );

  return (
    <>
      {trigger}
      <MenuListContext value={menuListContextValue}>
        <MenuListContainer open={open} className={className}>
          {menu}
        </MenuListContainer>
      </MenuListContext>
    </>
  );
};

MenuList.Trigger = MenuListTrigger;
MenuList.ItemIcon = Icon;
MenuList.Menu = Menu;
MenuList.Item = MenuItem;

export default MenuList;
