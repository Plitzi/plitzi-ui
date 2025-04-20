import classNames from 'classnames';
import { use, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useTheme from '@hooks/useTheme';

import ContainerFloatingContext from './ContainerFloatingContext';

import type { ContainerFloatingProps } from './ContainerFloating';
import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode, RefObject } from 'react';

type ContainerFloatingContainerProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
} & useThemeSharedProps<typeof ContainerFloatingStyles, Omit<typeof variantKeys, 'placement'>>;

const ContainerFloatingContainer = ({
  ref,
  className,
  children,
  open,
  onOpenChange
}: ContainerFloatingContainerProps) => {
  const {
    container,
    triggerRef,
    placement: placementProp,
    containerTopOffset,
    containerLeftOffset,
    setOpen
  } = use(ContainerFloatingContext);
  const [placement, setPlacement] = useState(placementProp);
  className = useTheme<typeof ContainerFloatingStyles, typeof variantKeys>('ContainerFloating', {
    className,
    componentKey: 'container',
    variant: { placement }
  });
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => containerRef.current!, []);
  const [position, setPosition] = useState<{ top?: number; left?: number }>({ top: undefined, left: undefined });

  const updatePosition = useCallback(() => {
    if (!triggerRef) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() ?? { top: 0, left: 0, height: 0, width: 0 };
    let currentPlacement = placementProp;
    if (!placementProp) {
      const placementAux = ['bottom', 'left'];
      placementAux[0] = rect.top + containerRect.height > window.innerHeight ? 'top' : 'bottom';
      placementAux[1] = rect.left + containerRect.width > window.innerWidth ? 'right' : 'left';
      currentPlacement = placementAux.join('-') as NonNullable<ContainerFloatingProps['placement']>;
    }

    setPlacement(currentPlacement);
    const deltaX = containerLeftOffset ?? 0;
    const deltaY = containerTopOffset ?? 0;

    let top = 0,
      left = 0;
    if (currentPlacement === 'top-left') {
      top = rect.top - deltaY;
      left = rect.left + deltaX;
    } else if (currentPlacement === 'top-right') {
      top = rect.top - deltaY;
      left = rect.left - containerRect.width + rect.width - deltaX;
    } else if (currentPlacement === 'bottom-left') {
      top = rect.bottom + deltaY;
      left = rect.left + deltaX;
    } else {
      // bottom-right
      top = rect.bottom + deltaY;
      left = rect.left - containerRect.width + rect.width - deltaX;
    }

    setPosition({ top, left });
  }, [triggerRef, placementProp, containerLeftOffset, containerTopOffset]);

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

    onOpenChange?.(open);
  }, [open, updatePosition, onOpenChange]);

  const handleClickClose = useCallback(() => setOpen(false), [setOpen]);

  const containerStyle: CSSProperties = useMemo(() => ({ top: position.top, left: position.left }), [position]);

  return createPortal(
    <>
      <div
        ref={containerRef}
        style={containerStyle}
        className={classNames(className, {
          'opacity-0 pointer-events-none': position.top === undefined || position.left === undefined || !open
        })}
      >
        {children}
      </div>
      {open && <div className="absolute top-0 bottom-0 left-0 right-0" onClick={handleClickClose} />}
    </>,
    container ?? document.body
  );
};

export default ContainerFloatingContainer;
