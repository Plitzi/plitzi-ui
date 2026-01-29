import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import PopupSidePanel from './components/PopupSidePanel';
import PopupManager from './helpers/PopupManager';
import { PopupContextFloating, PopupContextLeft, PopupContextRight } from './PopupContext';
import PopupFloatingArea from './PopupFloatingArea';

import type { PopupPlacement, PopupSettings } from './Popup';
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { AccordionProps } from '@components/Accordion';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type PopupInstance = {
  id: string;
  component: ReactNode;
  active: boolean;
  position?: number;
  size?: AccordionProps['size'];
  settings: PopupSettings;
};

export type Popups = Record<string, PopupInstance[]>;

export type PopupProviderProps = {
  children?: ReactNode;
  floatingClassName?: string;
  floatingFixedArea?: boolean;
  renderLeftPopup?: boolean;
  renderRightPopup?: boolean;
  renderFloatingPopup?: boolean;
  multi?: boolean;
  canHide?: boolean;
  popups?: Popups;
  limitMode?: ContainerDraggableProps['limitMode'];
  leftMinWidth?: number;
  leftMaxWidth?: number;
  rightMinWidth?: number;
  rightMaxWidth?: number;
  onChange?: (value: Popups) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupProvider = ({
  children,
  floatingClassName = 'h-screen w-screen',
  floatingFixedArea = true,
  renderLeftPopup = true,
  renderRightPopup = true,
  renderFloatingPopup = true,
  multi = false,
  canHide = true,
  popups,
  limitMode = 'window' as const,
  size,
  leftMinWidth,
  leftMaxWidth,
  rightMinWidth,
  rightMaxWidth,
  onChange
}: PopupProviderProps) => {
  const [, setRerender] = useState(0);
  const popupManager = useMemo(() => new PopupManager(['left', 'right', 'floating'], popups), [popups]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const placementCacheRef = useRef<{ [key: string]: PopupPlacement | undefined }>(popupManager.getPlacementByPopup());

  useDidUpdateEffect(() => {
    placementCacheRef.current = popupManager.getPlacementByPopup();
    setRerender(Date.now());
  }, [popupManager]);

  const addPopup = useCallback(
    (id: string, component: ReactNode, settings: PopupSettings = {} as PopupSettings, active: boolean = true) => {
      if (!settings.placement || !popupManager.add(settings.placement, { id, component, active, settings })) {
        return;
      }

      placementCacheRef.current = popupManager.getPlacementByPopup();
      setRerender(Date.now());
      onChangeRef.current?.(popupManager.getAll());
    },
    [popupManager]
  );

  const removePopup = useCallback(
    (popupId: string) => {
      if (!popupManager.remove(popupId)) {
        return;
      }

      placementCacheRef.current = popupManager.getPlacementByPopup();
      setRerender(Date.now());
      onChangeRef.current?.(popupManager.getAll());
    },
    [popupManager]
  );

  const existsPopup = useCallback((popupId: string) => popupManager.exists(popupId), [popupManager]);

  const placementPopup = useCallback(
    (popupId: string, placement: PopupPlacement) => {
      const currentPlacement = placementCacheRef.current[popupId];
      if (!currentPlacement || !popupManager.changePlacement(popupId, placement)) {
        return;
      }

      placementCacheRef.current = popupManager.getPlacementByPopup();
      setRerender(Date.now());
      onChangeRef.current?.(popupManager.getAll());
    },
    [popupManager]
  );

  const focusPopup = useCallback(
    (popupId: string) => {
      popupManager.focusFloating(popupId);
      setRerender(Date.now());
    },
    [popupManager]
  );

  const popupContextValueFloating = useMemo(
    () => ({
      popups: popupManager.get('floating'),
      popupIds: popupManager.get('floating').map(popup => popup.id),
      popupActiveIds: popupManager
        .get('floating')
        .filter(popup => popup.active)
        .map(popup => popup.id),
      limitMode,
      addPopup,
      focusPopup,
      placementPopup,
      existsPopup,
      removePopup
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupManager.getLastUpdate('floating')]
  );

  const popupContextValueLeft = useMemo(
    () => ({
      popups: popupManager.get('left'),
      popupIds: popupManager.get('left').map(popup => popup.id),
      popupActiveIds: popupManager
        .get('left')
        .filter(popup => popup.active)
        .map(popup => popup.id),
      limitMode,
      addPopup,
      focusPopup,
      placementPopup,
      existsPopup,
      removePopup
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupManager.getLastUpdate('left')]
  );

  const popupContextValueRight = useMemo(
    () => ({
      popups: popupManager.get('right'),
      popupIds: popupManager.get('right').map(popup => popup.id),
      popupActiveIds: popupManager
        .get('right')
        .filter(popup => popup.active)
        .map(popup => popup.id),
      limitMode,
      addPopup,
      focusPopup,
      placementPopup,
      existsPopup,
      removePopup
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupManager.getLastUpdate('right')]
  );

  return (
    <PopupContextFloating value={popupContextValueFloating}>
      <PopupContextLeft value={popupContextValueLeft}>
        <PopupContextRight value={popupContextValueRight}>
          {renderLeftPopup && !!popupManager.getCount('left') && (
            <PopupSidePanel
              placement="left"
              placementTabs="left"
              multi={multi}
              canHide={canHide}
              size={size}
              minWidth={leftMinWidth}
              maxWidth={leftMaxWidth}
            />
          )}
          {children}
          {renderFloatingPopup && !!popupManager.getCount('floating') && (
            <PopupFloatingArea
              className={clsx(
                'pr-20 z-50 flex justify-end items-end pointer-events-none overflow-visible',
                { 'fixed top-0 left-0': floatingFixedArea },
                floatingClassName
              )}
            />
          )}
          {renderRightPopup && !!popupManager.getCount('right') && (
            <PopupSidePanel
              multi={multi}
              canHide={canHide}
              size={size}
              minWidth={rightMinWidth}
              maxWidth={rightMaxWidth}
            />
          )}
        </PopupContextRight>
      </PopupContextLeft>
    </PopupContextFloating>
  );
};

export default PopupProvider;
