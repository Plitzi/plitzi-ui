// Packages
import { use, useMemo, useState, useCallback, useEffect } from 'react';

// Alias
import Accordion from '@components/Accordion';
import Button from '@components/Button';
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
  value?: string[];
  onChange?: (value: string[]) => void;
  onLoadPopups?: (value: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidebar = ({
  className = '',
  placement = 'right',
  placementTabs = 'right',
  canHide = false,
  multiSelect = false,
  minWidth = 280,
  maxWidth = 500,
  value: valueProp = popupsActiveDefault,
  onChange,
  onLoadPopups
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
    const popupsSelected = valueProp.length > 0 ? valueProp : popups.map(popup => popup.id);
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
    setPopupsActive(valueProp);
  }, [valueProp]);

  const handleChangeTabs = useCallback(
    (popsActive: string[]) => {
      onChange?.(popsActive);
      setPopupsActive(popsActive);
    },
    [onChange]
  );

  const handleClickFloating = useCallback(
    (popupId: string) => () => placementPopup?.(popupId)('floating'),
    [placementPopup]
  );

  const handleClickCollapse = useCallback(
    (popupId: string) => () => setPopupsActive(state => state.filter(item => item !== popupId)),
    []
  );

  useEffect(() => {
    if (popupsActive.length > 0 && onLoadPopups) {
      onLoadPopups(popupsActive);
    }
  }, [popups, onLoadPopups, popupsActive]);

  if (!popups.length) {
    return undefined;
  }

  if (popupsActive.length === 0 && placementTabs !== 'top' && canHide) {
    return (
      <PopupSidebarTabs
        className={className}
        placement={placementTabs}
        popupsActive={popupsActive}
        multiSelect={multiSelect}
        canHide={canHide}
        onChange={handleChangeTabs}
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
        <PopupSidebarTabs
          placement={placementTabs}
          popupsActive={popupsActive}
          onChange={handleChangeTabs}
          multiSelect={multiSelect}
          canHide={canHide}
        />
        <Accordion
          className={classNameTheme.sidebarContainer}
          grow
          gap={0}
          multi={multiSelect}
          defaultValue={popupsActive.length > 0 ? popupsActive.slice(0, 1) : [popups[0].id]}
        >
          {popups
            .filter(pop => popupsActive.includes(pop.id))
            .map((popup, i) => {
              return (
                <Accordion.Item
                  key={popup.id}
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
                    {(placement === 'left' || placement === 'right') && (
                      <Button
                        intent="custom"
                        size="custom"
                        border="none"
                        className={classNameTheme.btn}
                        title="Hide"
                        content=""
                        onClick={handleClickCollapse(popup.id)}
                      >
                        <Button.Icon
                          icon={placement === 'left' ? 'fa-solid fa-angles-left' : 'fa-solid fa-angles-right'}
                        />
                      </Button>
                    )}
                  </Accordion.Item.Header>
                  <Accordion.Item.Content>{popup.component}</Accordion.Item.Content>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
    </ContainerResizable>
  );
};

export default PopupSidebar;
