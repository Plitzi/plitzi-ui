// Packages
import classNames from 'classnames';
import get from 'lodash/get';
import omit from 'lodash/omit';
import { useCallback, useMemo, useRef, useState } from 'react';

// Relatives
import PopupContext from './PopupContext';
import PopupFloatingArea from './PopupFloatingArea';
import PopupSidebar from './PopupSidebar';

// Types
import type { PopupPlacement, PopupSettings } from './Popup';
import type { ContainerDraggableProps } from '@components/ContainerDraggable';
import type { ReactNode } from 'react';

export type PopupInstance = { id: string; component: ReactNode; settings: PopupSettings };

type Popups = {
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
  multiSelect?: boolean;
  canHide?: boolean;
  popups?: Popups;
  limitMode?: ContainerDraggableProps['limitMode'];
};

const PopupProvider = ({
  children,
  floatingClassName = 'h-screen w-screen',
  floatingFixedArea = true,
  renderLeftPopup = true,
  renderRightPopup = true,
  renderFloatingPopup = true,
  multiSelect = false,
  canHide = true,
  popups = {
    left: [],
    right: [],
    floating: []
  },
  limitMode
}: PopupProviderProps) => {
  const [reRender, setRerender] = useState(0);
  const popupsRef = useRef<Popups>(popups);
  const placementCacheRef = useRef<{ [key: string]: PopupPlacement | undefined }>({
    ...popups.left.reduce((acum, popup) => ({ ...acum, [popup.id]: 'left' }), {}),
    ...popups.right.reduce((acum, popup) => ({ ...acum, [popup.id]: 'right' }), {}),
    ...popups.floating.reduce((acum, popup) => ({ ...acum, [popup.id]: 'floating' }), {})
  });

  const addPopup = useCallback((id: string, component: ReactNode, settings: PopupSettings = {} as PopupSettings) => {
    if (!settings.placement) {
      return;
    }

    popupsRef.current[settings.placement].push({ id, component, settings });
    placementCacheRef.current = { ...placementCacheRef.current, [id]: settings.placement ?? 'floating' };
    setRerender(Date.now());
  }, []);

  const removePopup = useCallback(
    (popupId: string) => () => {
      const placement = placementCacheRef.current[popupId];
      if (!placement) {
        return;
      }

      popupsRef.current[placement] = popupsRef.current[placement].filter(popup => popup.id !== popupId);
      placementCacheRef.current = omit(placementCacheRef.current, [popupId]);
      setRerender(Date.now());
    },
    []
  );

  const existsPopup = useCallback((popupId: string) => {
    const placement = placementCacheRef.current[popupId];
    if (!placement) {
      return false;
    }

    return !!popupsRef.current[placement].find(popup => popup.id === popupId);
  }, []);

  const placementPopup = useCallback(
    (popupId: string) => (placement: PopupPlacement) => {
      const currentPlacement = placementCacheRef.current[popupId];
      if (!currentPlacement) {
        return;
      }

      const pops = popupsRef.current;
      const popupIndex = pops[currentPlacement].findIndex(popup => popup.id === popupId);
      const popupInstance = pops[currentPlacement][popupIndex];
      pops[currentPlacement].splice(popupIndex, 1);
      pops[placement].push(popupInstance);
      placementCacheRef.current[popupId] = placement;
      setRerender(Date.now());
    },
    []
  );

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

  const popupContextValue = useMemo(
    () => ({
      popupLeft: get(popupsRef.current, 'left', []),
      popupRight: get(popupsRef.current, 'right', []),
      popupFloating: get(popupsRef.current, 'floating', []),
      limitMode,
      addPopup,
      focusPopup,
      placementPopup,
      existsPopup,
      removePopup
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addPopup, focusPopup, placementPopup, existsPopup, removePopup, limitMode, reRender]
  );

  return (
    <PopupContext value={popupContextValue}>
      {renderLeftPopup && popupsRef.current.left.length > 0 && (
        <PopupSidebar placement="left" placementTabs="left" multiSelect={multiSelect} canHide={canHide} />
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
      {renderRightPopup && popupsRef.current.right.length > 0 && (
        <PopupSidebar multiSelect={multiSelect} canHide={canHide} />
      )}
    </PopupContext>
  );
};

export default PopupProvider;
