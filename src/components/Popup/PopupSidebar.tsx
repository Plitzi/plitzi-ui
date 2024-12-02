// Packages
import noop from 'lodash/noop';
import { use, useMemo, useState, useRef, useCallback, useEffect } from 'react';

// Alias
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

// Relatives
import PopupSidebarTabs from './PopupSidebarTabs';
import usePopup from './usePopup';

// Types
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { PopupInstance } from './PopupProvider';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';

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
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidebar = ({
  className = '',
  placement = 'right',
  placementTabs = 'right',
  canHide = false,
  multiSelect = false,
  minWidth = 280,
  maxWidth = 500,
  popupsActive: popupsActiveProp = popupsActiveDefault,
  onSelect = noop,
  onLoadPopups = noop
}: PopupSidebarProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys, false>('Popup', {
    className,
    componentKey: ['sidebarRoot', 'sidebar', 'sidebarContainer'],
    variant: { placement: placementTabs }
  });
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
  const [popupsActive, setPopupsActive] = useState(() => {
    const popupsSelected = popupsActiveProp.length > 0 ? popupsActiveProp : popups.map(popup => popup.id);
    if (multiSelect) {
      return popupsSelected;
    }

    if (popupsSelected.length > 0) {
      return [popupsSelected[0]];
    }

    return [];
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizeHeight, setResizeHeight] = useState(Infinity);
  const resizeHandles = useMemo<ResizeHandle[]>(() => {
    if (placementTabs === 'top') {
      return ['s'];
    }

    if (placementTabs === 'left') {
      return ['e'];
    }

    return ['w'];
  }, [placementTabs]);
  const { rootDOM } = use(ContainerRootContext);

  useDidUpdateEffect(() => {
    setPopupsActive(popupsActiveProp);
  }, [popupsActiveProp]);

  useEffect(() => {
    let resizeHeight = Infinity;
    if (containerRef.current && popupsActive.length > 1) {
      resizeHeight = containerRef.current.offsetHeight / popupsActive.length;
    }

    setResizeHeight(resizeHeight);
  }, [popupsActive]);

  const handleClickTab = useCallback(
    (popupId: string) => {
      if (popupsActive.includes(popupId) && popupsActive.length === 1) {
        return;
      }

      let newPopupsActive = popupsActive;
      if (popupsActive.includes(popupId) && canHide) {
        newPopupsActive = popupsActive.filter(i => i !== popupId);
      } else if (popupsActive.includes(popupId)) {
        newPopupsActive = popupsActive.filter(i => i !== popupId);
      } else if (multiSelect) {
        newPopupsActive = [...popupsActive, popupId];
      } else {
        newPopupsActive = [popupId];
      }

      onSelect(popupId, newPopupsActive);
      setPopupsActive(newPopupsActive);
    },
    [multiSelect, canHide, onSelect, popupsActive]
  );

  useEffect(() => {
    if (popupsActive.length > 0) {
      onLoadPopups(popupsActive);
    }
  }, [popups, onLoadPopups, popupsActive]);

  const popupsChildren = useMemo(
    () =>
      popups
        .filter(pop => popupsActive.includes(pop.id))
        .map((popup, i) => {
          if (i !== popupsActive.length - 1) {
            return (
              <ContainerResizable key={popup.id} resizeHandles={['s']} height={resizeHeight} autoGrow={false}>
                <div className="flex flex-col grow min-h-0 basis-0">{popup.component}</div>
              </ContainerResizable>
            );
          }

          return (
            <div key={popup.id} className="flex flex-col grow min-h-0 basis-0">
              {popup.component}
            </div>
          );
        }),
    [popups, popupsActive, resizeHeight]
  );

  if (!popups.length) {
    return undefined;
  }

  if (popupsActive.length === 0 && placementTabs !== 'top' && canHide) {
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
      className={classNameTheme.sidebarRoot}
      autoGrow={false}
      minConstraintsX={minWidth}
      minConstraintsY={Infinity}
      maxConstraintsX={maxWidth}
      width={minWidth}
      resizeHandles={resizeHandles}
      parentElement={rootDOM}
    >
      <div className={classNameTheme.sidebar}>
        <PopupSidebarTabs placementTabs={placementTabs} popupsActive={popupsActive} onTabClick={handleClickTab} />
        <div ref={containerRef} className={classNameTheme.sidebarContainer}>
          {popupsChildren}
        </div>
      </div>
    </ContainerResizable>
  );
};

export default PopupSidebar;
