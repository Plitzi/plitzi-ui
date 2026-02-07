import { use, useMemo, useCallback, memo } from 'react';

import { emptyArray } from '@/helpers/utils';
import Accordion from '@components/Accordion';
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';
import useTheme from '@hooks/useTheme';

import PopupSidePanelItem from './PopupSidePanelItem';
import usePopup from '../../hooks/usePopup';
import PopupSidebar from '../../PopupSidebar';

import type PopupStyles from '../../Popup.styles';
import type { variantKeys } from '../../Popup.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type PopupSidePanelProps = {
  placement?: 'left' | 'right';
  placementTabs?: 'left' | 'right';
  canHide?: boolean;
  showSidebar?: boolean;
  minWidth?: number;
  maxWidth?: number;
  separatorsBefore?: string[];
  onChange?: (value: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidePanel = ({
  className = '',
  placement = 'right',
  placementTabs = 'right',
  canHide = false,
  showSidebar = true,
  minWidth = 280,
  maxWidth = 500,
  separatorsBefore = emptyArray,
  size,
  onChange
}: PopupSidePanelProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: ['sidePanelRoot', 'sidePanel', 'sidePanelContainer'],
    variants: { placement: placementTabs, size }
  });
  const { rootDOM } = use(ContainerRootContext);
  const { popupManager, popups, popupActiveIds, multi, multiExpanded } = usePopup(placement);
  const resizeHandles = useMemo<ResizeHandle[]>(() => (placementTabs === 'left' ? ['e'] : ['w']), [placementTabs]);

  const handleChangeTabs = useCallback(
    (popsActive: string[]) => {
      onChange?.(popsActive);
      popupManager.setActiveMany(popsActive, placement);
    },
    [onChange, placement, popupManager]
  );

  const handleClickFloating = useCallback(
    (popupId: string) => {
      popupManager.changePlacement(popupId, 'floating');
      const newValue = popupActiveIds.filter(item => item !== popupId);
      onChange?.(newValue);
    },
    [onChange, popupActiveIds, popupManager]
  );

  const handleClickCollapse = useCallback(
    (popupId: string) => {
      popupManager.setActive(popupId, false, placement);
      const newValue = popupActiveIds.filter(item => item !== popupId);
      onChange?.(newValue);
    },
    [popupActiveIds, popupManager, placement, onChange]
  );

  const popupsFiltered = useMemo(() => {
    const pops = popups.filter(pop => popupActiveIds.includes(pop.id) && !!pop.component);
    if (!multi) {
      return pops.slice(0, 1);
    }

    return pops;
  }, [multi, popupActiveIds, popups]);

  if (!popups.length || (popupActiveIds.length === 0 && !showSidebar)) {
    return undefined;
  }

  if (popupsFiltered.length === 0 && canHide) {
    return (
      <PopupSidebar
        placement={placementTabs}
        value={popupActiveIds}
        canEmpty={canHide}
        size={size}
        separatorsBefore={separatorsBefore}
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
            value={popupActiveIds}
            canEmpty={canHide}
            size={size}
            separatorsBefore={separatorsBefore}
            onChange={handleChangeTabs}
          />
        )}
        <Accordion
          className={classNameTheme.sidePanelContainer}
          size={size}
          grow
          multi={multi}
          alwaysOpen
          defaultValue={
            popupActiveIds.length > 1 ? (multiExpanded ? popupActiveIds : popupActiveIds.slice(0, 1)) : popupActiveIds
          }
        >
          {popupsFiltered.map((popup, i) => (
            <PopupSidePanelItem
              key={popup.id}
              className={i > 0 ? 'border-t border-solid border-gray-300' : ''}
              id={popup.id}
              title={popup.settings.title}
              minSize={popup.placementSettings?.[placement]?.minSize}
              maxSize={popup.placementSettings?.[placement]?.maxSize}
              placement={placement}
              size={size}
              allowFloatingSide={popup.settings.allowFloatingSide}
              onClickFloating={handleClickFloating}
              onClickCollapse={handleClickCollapse}
            >
              {popup.component}
            </PopupSidePanelItem>
          ))}
        </Accordion>
      </div>
    </ContainerResizable>
  );
};

export default memo(PopupSidePanel);
