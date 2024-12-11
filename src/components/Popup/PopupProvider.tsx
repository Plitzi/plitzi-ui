// Packages
import classNames from 'classnames';
import get from 'lodash/get';
import omit from 'lodash/omit';
import { useCallback, useMemo, useRef, useState } from 'react';

// Relatives
import { PopupContextFloating, PopupContextLeft, PopupContextRight } from './PopupContext';
import PopupFloatingArea from './PopupFloatingArea';
import PopupSidePanel from './PopupSidePanel';

// Types
import type { PopupPlacement, PopupSettings } from './Popup';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupInstance = { id: string; component: ReactNode; active: boolean; settings: PopupSettings };

export type Popups = {
  left: PopupInstance[];
  right: PopupInstance[];
  floating: PopupInstance[];
};

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
  onChange?: (value: Popups) => void;
};

const defaultPopups = { left: [], right: [], floating: [] };

const PopupProvider = ({
  children,
  floatingClassName = 'h-screen w-screen',
  floatingFixedArea = true,
  renderLeftPopup = true,
  renderRightPopup = true,
  renderFloatingPopup = true,
  multi = false,
  canHide = true,
  popups = defaultPopups,
  limitMode,
  onChange
}: PopupProviderProps) => {
  const [, setRerender] = useState(0);
  const popupsRef = useRef<Popups>(popups);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const placementCacheRef = useRef<{ [key: string]: PopupPlacement | undefined }>({
    ...popups.left.reduce((acum, popup) => ({ ...acum, [popup.id]: 'left' }), {}),
    ...popups.right.reduce((acum, popup) => ({ ...acum, [popup.id]: 'right' }), {}),
    ...popups.floating.reduce((acum, popup) => ({ ...acum, [popup.id]: 'floating' }), {})
  });

  const addPopup = useCallback(
    (id: string, component: ReactNode, settings: PopupSettings = {} as PopupSettings, active: boolean = true) => {
      if (!settings.placement) {
        return;
      }

      popupsRef.current[settings.placement] = [
        ...popupsRef.current[settings.placement],
        { id, component, active, settings }
      ];
      placementCacheRef.current = { ...placementCacheRef.current, [id]: settings.placement ?? 'floating' };
      setRerender(Date.now());
      onChangeRef.current?.(popupsRef.current);
    },
    []
  );

  const removePopup = useCallback((popupId: string) => {
    const placement = placementCacheRef.current[popupId];
    if (!placement) {
      return;
    }

    popupsRef.current[placement] = popupsRef.current[placement].filter(popup => popup.id !== popupId);
    placementCacheRef.current = omit(placementCacheRef.current, [popupId]);
    setRerender(Date.now());
    onChangeRef.current?.(popupsRef.current);
  }, []);

  const existsPopup = useCallback((popupId: string) => {
    const placement = placementCacheRef.current[popupId];
    if (!placement) {
      return false;
    }

    return !!popupsRef.current[placement].find(popup => popup.id === popupId);
  }, []);

  const placementPopup = useCallback((popupId: string, placement: PopupPlacement) => {
    const currentPlacement = placementCacheRef.current[popupId];
    if (!currentPlacement) {
      return;
    }

    const pops = popupsRef.current;
    const popupIndex = pops[currentPlacement].findIndex(popup => popup.id === popupId);
    const popupInstance = pops[currentPlacement][popupIndex];
    pops[currentPlacement] = pops[currentPlacement].toSpliced(popupIndex, 1);
    pops[placement] = pops[placement] = [...pops[placement], popupInstance];
    placementCacheRef.current[popupId] = placement;
    setRerender(Date.now());
    onChangeRef.current?.(popupsRef.current);
  }, []);

  const focusPopup = useCallback(
    (popupId: string, sort: number = -1) =>
      () => {
        const placement = placementCacheRef.current[popupId];
        if (!placement) {
          return;
        }

        const popupsArr = popupsRef.current;
        if (popupsArr[placement].length < 1 || popupsArr[placement][popupsArr[placement].length - 1].id === popupId) {
          return;
        }

        popupsArr[placement] = popupsArr[placement].toSorted((_, popup2) => (popup2.id === popupId ? sort : 0));
        setRerender(Date.now());
      },
    []
  );

  const popupContextValueFloating = useMemo(
    () => ({
      popups: get(popupsRef.current, 'floating', []),
      popupIds: get(popupsRef.current, 'floating', []).map(popup => popup.id),
      popupActiveIds: get(popupsRef.current, 'floating', [])
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
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupsRef.current.floating]
  );

  const popupContextValueLeft = useMemo(
    () => ({
      popups: get(popupsRef.current, 'left', []),
      popupIds: get(popupsRef.current, 'left', []).map(popup => popup.id),
      popupActiveIds: get(popupsRef.current, 'left', [])
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
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupsRef.current.left]
  );

  const popupContextValueRight = useMemo(
    () => ({
      popups: get(popupsRef.current, 'right', []),
      popupIds: get(popupsRef.current, 'right', []).map(popup => popup.id),
      popupActiveIds: get(popupsRef.current, 'right', [])
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
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, popupsRef.current.right]
  );

  return (
    <PopupContextFloating value={popupContextValueFloating}>
      <PopupContextLeft value={popupContextValueLeft}>
        <PopupContextRight value={popupContextValueRight}>
          {renderLeftPopup && popupsRef.current.left.length > 0 && (
            <PopupSidePanel placement="left" placementTabs="left" multi={multi} canHide={canHide} />
          )}
          {children}
          {renderFloatingPopup && popupsRef.current.floating.length > 0 && (
            <PopupFloatingArea
              className={classNames(
                'pr-20 z-50 flex justify-end items-end pointer-events-none overflow-visible',
                { 'fixed top-0 left-0': floatingFixedArea },
                floatingClassName
              )}
            />
          )}
          {renderRightPopup && popupsRef.current.right.length > 0 && <PopupSidePanel multi={multi} canHide={canHide} />}
        </PopupContextRight>
      </PopupContextLeft>
    </PopupContextFloating>
  );
};

export default PopupProvider;
