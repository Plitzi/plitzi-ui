import { createContext } from 'react';

import type { MenuListProps } from './MenuList';
import type { RefObject } from 'react';

export type MenuListContextValue = {
  triggerRef?: RefObject<HTMLDivElement>;
  parentMenuRef?: RefObject<HTMLDivElement>;
  container?: Element | DocumentFragment;
  open?: boolean;
  placement?: MenuListProps['placement'];
};

const menuListContextDefaultValue = {} as MenuListContextValue;

const MenuListContext = createContext<MenuListContextValue>(menuListContextDefaultValue);

export default MenuListContext;
