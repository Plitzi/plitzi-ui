// Packages
import noop from 'lodash/noop';
import { use, useMemo, useState, useCallback, useEffect } from 'react';

// Alias
import Accordion from '@components/Accordion';
import Button from '@components/Button';
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

// Relatives
// import PopupSidebarItem from './PopupSidebarItem';
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
  const { placementPopup, popupLeft, popupRight } = usePopup();
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

  const handleClickTab = useCallback(
    (popupId: string) => {
      if (!canHide && popupsActive.includes(popupId) && popupsActive.length === 1) {
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

  const handleClickFloating = useCallback(
    (popupId: string) => () => placementPopup?.(popupId)('floating'),
    [placementPopup]
  );

  useEffect(() => {
    if (popupsActive.length > 0) {
      onLoadPopups(popupsActive);
    }
  }, [popups, onLoadPopups, popupsActive]);

  const handleClick = useCallback((popupId: string) => () => handleClickTab(popupId), [handleClickTab]);

  const popupsChildren = useMemo(() => {
    return (
      <Accordion
        className={classNameTheme.sidebarContainer}
        grow
        gap={0}
        multi={multiSelect}
        defaultIndex={popupsActive.length > 0 ? popupsActive.slice(0, 1) : [popups[0].id]}
      >
        {popups
          .filter(pop => popupsActive.includes(pop.id))
          .map((popup, i) => {
            return (
              <Accordion.Item
                key={i}
                id={popup.id}
                grow
                className={i > 0 ? 'border-t border-solid border-gray-300' : ''}
              >
                <Accordion.Item.Header
                  title={popup.settings.title}
                  iconExpanded={null}
                  iconCollapsed={null}
                  direction={placement === 'left' ? 'row-reverse' : 'row'}
                >
                  <Button
                    intent="custom"
                    size="custom"
                    border="none"
                    className={classNameTheme.btn}
                    title="Floating Popup"
                    content=""
                    onClick={handleClickFloating(popup.id)}
                  >
                    <Button.Icon icon="fas fa-window-restore" />
                  </Button>
                  <Button
                    intent="custom"
                    size="custom"
                    border="none"
                    className={classNameTheme.btn}
                    title="Hide"
                    content=""
                    onClick={handleClick(popup.id)}
                  >
                    <Button.Icon icon={placement === 'left' ? 'fa-solid fa-angles-left' : 'fa-solid fa-angles-right'} />
                  </Button>
                </Accordion.Item.Header>
                <Accordion.Item.Content>{popup.component}</Accordion.Item.Content>
              </Accordion.Item>
            );
          })}
      </Accordion>
    );
  }, [
    classNameTheme.sidebarContainer,
    classNameTheme.btn,
    multiSelect,
    popupsActive,
    popups,
    placement,
    handleClickFloating,
    handleClick
  ]);

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
        {popupsChildren}
      </div>
    </ContainerResizable>
  );
};

export default PopupSidebar;
