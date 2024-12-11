// Packages
import { use, useMemo, useState, useCallback, memo } from 'react';

// Alias
import { arrayDifference } from '@/helpers/utils';
import Accordion from '@components/Accordion';
import Button from '@components/Button';
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

// Relatives
import PopupSidebar from './PopupSidebar';
import usePopup from './usePopup';

// Types
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';

const popupsActiveDefault: string[] = [];

export type PopupSidePanelProps = {
  className?: string;
  placement?: 'left' | 'right';
  placementTabs?: 'left' | 'right';
  canHide?: boolean;
  multi?: boolean;
  showSidebar?: boolean;
  minWidth?: number;
  maxWidth?: number;
  value?: string[];
  onChange?: (value: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidePanel = ({
  className = '',
  placement = 'right',
  placementTabs = 'right',
  canHide = false,
  multi = false,
  showSidebar = true,
  minWidth = 280,
  maxWidth = 500,
  value: valueProp = popupsActiveDefault,
  onChange
}: PopupSidePanelProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys, false>('Popup', {
    className,
    componentKey: ['sidePanelRoot', 'sidePanel', 'sidePanelContainer'],
    variant: { placement: placementTabs }
  });
  const { placementPopup, popups, popupIds, popupActiveIds } = usePopup(placement);
  const [popupsActive, setPopupsActive] = useState(() => {
    const popupsSelected = valueProp.length > 0 ? valueProp : popupActiveIds;
    if (multi) {
      return popupsSelected;
    }

    if (popupsSelected.length > 0) {
      return [popupsSelected[0]];
    }

    return [];
  });
  const popupsActiveFiltered = useMemo(
    () => popupsActive.filter(val => popupIds.includes(val)),
    [popupsActive, popupIds]
  );
  const resizeHandles = useMemo<ResizeHandle[]>(() => {
    if (placementTabs === 'left') {
      return ['e'];
    }

    return ['w'];
  }, [placementTabs]);
  const { rootDOM } = use(ContainerRootContext);

  useDidUpdateEffect(() => {
    setPopupsActive(valueProp);
  }, [valueProp]);

  useDidUpdateEffect(
    prevState => {
      const newPopupsIds = [...popupsActiveFiltered, ...arrayDifference(prevState[0] as string[], popupActiveIds)];
      onChange?.(newPopupsIds);
      setPopupsActive(newPopupsIds);
    },
    [popupActiveIds]
  );

  const handleChangeTabs = useCallback(
    (popsActive: string[]) => {
      onChange?.(popsActive);
      setPopupsActive(popsActive);
    },
    [onChange]
  );

  const handleClickFloating = useCallback(
    (popupId: string) => () => {
      placementPopup?.(popupId, 'floating');
      const newValue = popupsActiveFiltered.filter(item => item !== popupId);
      setPopupsActive(newValue);
      onChange?.(newValue);
    },
    [onChange, placementPopup, popupsActiveFiltered]
  );

  const handleClickCollapse = useCallback(
    (popupId: string) => () => {
      const newValue = popupsActiveFiltered.filter(item => item !== popupId);
      setPopupsActive(newValue);
      onChange?.(newValue);
    },
    [popupsActiveFiltered, onChange]
  );

  if (!popups.length || (popupsActiveFiltered.length === 0 && !showSidebar)) {
    return undefined;
  }

  if (popupsActiveFiltered.length === 0 && canHide) {
    return (
      <PopupSidebar
        placement={placementTabs}
        value={popupsActiveFiltered}
        multi={multi}
        canEmpty={canHide}
        onChange={handleChangeTabs}
      />
    );
  }

  return (
    <ContainerResizable
      className={classNameTheme.sidePanelRoot}
      autoGrow={false}
      minConstraintsX={minWidth}
      minConstraintsY={Infinity}
      maxConstraintsX={maxWidth}
      width={minWidth}
      resizeHandles={resizeHandles}
      parentElement={rootDOM}
    >
      <div className={classNameTheme.sidePanel}>
        {showSidebar && (
          <PopupSidebar
            placement={placementTabs}
            value={popupsActiveFiltered}
            multi={multi}
            canEmpty={canHide}
            onChange={handleChangeTabs}
          />
        )}
        <Accordion
          className={classNameTheme.sidePanelContainer}
          grow
          gap={0}
          multi={multi}
          defaultValue={popupsActiveFiltered.length > 0 ? popupsActiveFiltered.slice(0, 1) : [popups[0].id]}
        >
          {popups
            .filter(pop => popupsActiveFiltered.includes(pop.id))
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

export default memo(PopupSidePanel);
