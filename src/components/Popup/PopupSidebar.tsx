// Packages
import classNames from 'classnames';
import noop from 'lodash/noop';
import { use, useMemo, useState, useRef, useCallback, useEffect } from 'react';

// Alias
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';

// Relatives
import PopupSidebarTabs from './PopupSidebarTabs';
import usePopup from './usePopup';

// Types
import type { PopupInstance } from './PopupProvider';
import type { ResizeHandle } from '@components/ContainerResizable';

export const POPUP_SIDEBAR_PLACEMENT_TOP = 'top';
export const POPUP_SIDEBAR_PLACEMENT_LEFT = 'left';
export const POPUP_SIDEBAR_PLACEMENT_RIGHT = 'right';

const popupsActiveDefault: string[] = [];

export type PopupSidebarProps = {
  className?: string;
  placement?: 'left' | 'right' | 'top';
  placementTabs?: 'top' | 'left' | 'right' | 'none';
  canHide?: boolean;
  multiSelect?: boolean;
  minWidth?: number;
  maxWidth?: number;
  popupsActive?: string[];
  onSelect?: (popupId: string, popupsActive: string[]) => void;
  onLoadPopups?: (popupsActive: string[]) => void;
};

const PopupSidebar = ({
  className = '',
  placement = POPUP_SIDEBAR_PLACEMENT_RIGHT,
  placementTabs = 'right',
  canHide = false,
  multiSelect = false,
  minWidth = 280,
  maxWidth = 500,
  popupsActive: popupsActiveProp = popupsActiveDefault,
  onSelect = noop,
  onLoadPopups = noop
}: PopupSidebarProps) => {
  const { popupLeft, popupRight } = usePopup();
  const popups = useMemo<PopupInstance[]>(() => {
    if (placement === 'left') {
      return popupLeft;
    }

    if (placement === 'right') {
      return popupRight;
    }

    return [];
  }, [placement, popupLeft, popupRight]);
  const containerRef = useRef<HTMLDivElement>(undefined);
  const resizeHandles = useMemo<ResizeHandle[]>(() => {
    if (placementTabs === POPUP_SIDEBAR_PLACEMENT_TOP) {
      return ['s'];
    }

    if (placementTabs === POPUP_SIDEBAR_PLACEMENT_LEFT) {
      return ['e'];
    }

    return ['w'];
  }, [placementTabs]);
  const { rootDOM } = use(ContainerRootContext);
  const [, setRerender] = useState(false);
  const prevPopups = useRef(popups);
  const popupsActiveRef = useRef<string[]>([]);
  popupsActiveRef.current = popupsActiveProp.filter(item => popups.map(popup => popup.id).includes(item));

  const processItems = useCallback(
    (prevItems: PopupInstance[], items: PopupInstance[]) => {
      if (items.length === 0 && popupsActiveRef.current.length === 0) {
        return popupsActiveRef.current;
      }

      if (items.length === 0 && popupsActiveRef.current.length > 0) {
        return [];
      }

      if (items.length > 0 && popupsActiveRef.current.length === 0 && !canHide) {
        return [items[items.length - 1].id];
      }

      if (prevItems.length > items.length) {
        // Items Removed
        const itemsRemoved = prevItems.filter(item => !items.includes(item));

        return popupsActiveRef.current.filter(item => !itemsRemoved.map(item => item.id).includes(item));
      }

      // Items Added
      const itemsAdded = items.filter(item => !prevItems.includes(item));
      if (itemsAdded.length === 0) {
        return popupsActiveRef.current;
      }

      return [...popupsActiveRef.current, ...itemsAdded.map(item => item.id)];
    },
    [popupsActiveRef, canHide]
  );

  const handleClickTab = useCallback(
    (popupId: string) => {
      if (popupsActiveRef.current.includes(popupId) && canHide) {
        popupsActiveRef.current = popupsActiveRef.current.filter(i => i !== popupId);
        setRerender(state => !state);
        onSelect(popupId, [...popupsActiveRef.current]);

        return;
      }

      if (multiSelect) {
        popupsActiveRef.current = [...popupsActiveRef.current, popupId];
      } else {
        popupsActiveRef.current = [popupId];
      }

      setRerender(state => !state);
      onSelect(popupId, [...popupsActiveRef.current]);
    },
    [multiSelect, setRerender, canHide, onSelect]
  );

  const popupsActive = useMemo(() => {
    popupsActiveRef.current = processItems(prevPopups.current, popups);
    prevPopups.current = popups;

    return popupsActiveRef.current;
  }, [popups, processItems]);

  useEffect(() => {
    if (popupsActive.length > 0) {
      onLoadPopups(popupsActive);
    }
  }, [popups, onLoadPopups, popupsActive]);

  const setContainerRef = useCallback(
    (node: HTMLDivElement) => {
      if (!containerRef.current) {
        containerRef.current = node;
        setRerender(state => !state);
      } else {
        containerRef.current = node;
      }
    },
    [containerRef, setRerender]
  );

  if (!popups.length) {
    return undefined;
  }

  if (popupsActive.length === 0 && placementTabs !== POPUP_SIDEBAR_PLACEMENT_TOP && canHide) {
    return (
      <PopupSidebarTabs
        className={className}
        placementTabs={placementTabs}
        popupsActive={popupsActive}
        onTabClick={handleClickTab}
      />
    );
  }

  return (
    <ContainerResizable
      className={className}
      autoGrow={false}
      minConstraintsX={minWidth}
      minConstraintsY={Infinity}
      maxConstraintsX={maxWidth}
      width={minWidth}
      resizeHandles={resizeHandles}
      parentElement={rootDOM}
    >
      <div
        className={classNames('h-full flex grow bg-white', {
          'flex-col': placementTabs === POPUP_SIDEBAR_PLACEMENT_TOP,
          'flex-row-reverse': placementTabs === POPUP_SIDEBAR_PLACEMENT_RIGHT
        })}
      >
        <PopupSidebarTabs placementTabs={placementTabs} popupsActive={popupsActive} onTabClick={handleClickTab} />
        <div
          ref={setContainerRef}
          className={classNames('flex flex-col grow', { 'min-w-0 overflow-y-auto': placementTabs !== 'top' })}
        >
          {popups
            .filter(pop => popupsActive.includes(pop.id))
            .map((popup, i) => {
              let height = Infinity;
              if (containerRef.current && popupsActive.length > 1) {
                height = containerRef.current.offsetHeight / popupsActive.length;
              }

              if (i !== popupsActive.length - 1) {
                return (
                  <ContainerResizable key={popup.id} resizeHandles={['s']} height={height} autoGrow={false}>
                    <div className="flex flex-col grow min-h-0 basis-0">{popup.component}</div>
                  </ContainerResizable>
                );
              }

              return (
                <div key={popup.id} className="flex flex-col grow min-h-0 basis-0">
                  {popup.component}
                </div>
              );
            })}
        </div>
      </div>
    </ContainerResizable>
  );
};

export default PopupSidebar;
