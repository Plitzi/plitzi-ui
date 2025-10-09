/* eslint-disable react-hooks/set-state-in-effect */
import classNames from 'classnames';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useTheme from '@hooks/useTheme';

import MenuListContext from './MenuListContext';

import type { MenuListProps } from './MenuList';
import type MenuListStyles from './MenuList.styles';
import type { variantKeys } from './MenuList.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode } from 'react';

type MenuListContainerProps = {
  open: boolean;
  children: ReactNode;
  asSubMenu?: boolean;
} & useThemeSharedProps<typeof MenuListStyles, Omit<typeof variantKeys, 'placement'>>;

const MenuListContainer = ({ className, children, open = false, asSubMenu = false }: MenuListContainerProps) => {
  const { container, triggerRef, placement: placementProp, parentMenuRef } = use(MenuListContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState(placementProp);
  className = useTheme<typeof MenuListStyles, typeof variantKeys>('MenuList', {
    className,
    componentKey: 'container',
    variants: { placement }
  });
  const [position, setPosition] = useState<{ top?: number; left?: number }>({ top: undefined, left: undefined });

  const updatePosition = useCallback(() => {
    if (!triggerRef) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() ?? { top: 0, left: 0, height: 0, width: 0 };
    const parentMenuRect = parentMenuRef?.current.getBoundingClientRect();
    let currentPlacement = placementProp;
    if (!placementProp) {
      const placementAux = ['bottom', 'left'];
      placementAux[0] = rect.top + containerRect.height > window.innerHeight ? 'top' : 'bottom';
      placementAux[1] = rect.left + containerRect.width > window.innerWidth ? 'right' : 'left';
      currentPlacement = placementAux.join('-') as NonNullable<MenuListProps['placement']>;
    }

    setPlacement(currentPlacement);
    const deltaX = 0;
    const deltaY = 4;
    const subDeltaX = 4;

    let top = 0,
      left = 0;
    if (currentPlacement === 'top-left') {
      top = rect.top - deltaY;
      left = rect.left + deltaX;
      if (asSubMenu && parentMenuRect) {
        top = parentMenuRect.top + parentMenuRect.height;
        left = parentMenuRect.left + parentMenuRect.width + deltaX + subDeltaX;
      }
    } else if (currentPlacement === 'top-right') {
      top = rect.top - deltaY;
      left = rect.left - containerRect.width + rect.width - deltaX;
      if (asSubMenu && parentMenuRect) {
        top = parentMenuRect.top + parentMenuRect.height;
        left = parentMenuRect.left + deltaX - subDeltaX;
      }
    } else if (currentPlacement === 'bottom-left') {
      top = rect.bottom + deltaY;
      left = rect.left + deltaX;
      if (asSubMenu && parentMenuRect) {
        top = parentMenuRect.top;
        left = parentMenuRect.left + parentMenuRect.width + deltaX + subDeltaX;
      }
    } else {
      // bottom-right
      top = rect.bottom + deltaY;
      left = rect.left - containerRect.width + rect.width - deltaX;
      if (asSubMenu && parentMenuRect) {
        top = parentMenuRect.top;
        left = parentMenuRect.left + deltaX - subDeltaX;
      }
    }

    setPosition({ top, left });
  }, [triggerRef, parentMenuRef, placementProp, asSubMenu]);

  const handleScroll = useCallback(() => open && updatePosition(), [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open, handleScroll]);

  useEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  const containerStyle: CSSProperties = useMemo(() => ({ top: position.top, left: position.left }), [position]);

  return createPortal(
    <div
      ref={containerRef}
      style={containerStyle}
      className={classNames('menu', className, {
        'opacity-0 pointer-events-none': position.top === undefined || position.left === undefined || !open,
        '-translate-x-full': asSubMenu && (placement === 'top-right' || placement === 'bottom-right')
      })}
    >
      {children}
    </div>,
    container ?? document.body
  );
};

export default MenuListContainer;
