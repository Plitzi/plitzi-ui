import { use, useMemo, useState, useCallback, memo } from 'react';

import { arrayDifference, emptyArray } from '@/helpers/utils';
import Accordion from '@components/Accordion';
import ContainerResizable from '@components/ContainerResizable';
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

import PopupSidePanelItem from './PopupSidePanelItem';
import usePopup from '../../hooks/usePopup';
import PopupSidebar from '../../PopupSidebar';

import type PopupStyles from '../../Popup.styles';
import type { variantKeys } from '../../Popup.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';

const popupsActiveDefault: string[] = [];

export type PopupSidePanelProps = {
  placement?: 'left' | 'right';
  placementTabs?: 'left' | 'right';
  canHide?: boolean;
  multi?: boolean;
  showSidebar?: boolean;
  minWidth?: number;
  maxWidth?: number;
  separatorsBefore?: string[];
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
  separatorsBefore = emptyArray,
  size,
  onChange
}: PopupSidePanelProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: ['sidePanelRoot', 'sidePanel', 'sidePanelContainer'],
    variants: { placement: placementTabs, size }
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
    (popupId: string) => {
      placementPopup(popupId, 'floating');
      const newValue = popupsActiveFiltered.filter(item => item !== popupId);
      setPopupsActive(newValue);
      onChange?.(newValue);
    },
    [onChange, placementPopup, popupsActiveFiltered]
  );

  const handleClickCollapse = useCallback(
    (popupId: string) => {
      const newValue = popupsActiveFiltered.filter(item => item !== popupId);
      setPopupsActive(newValue);
      onChange?.(newValue);
    },
    [popupsActiveFiltered, onChange]
  );

  const popupsFiltered = useMemo(
    () => popups.filter(pop => popupsActiveFiltered.includes(pop.id) && !!pop.component),
    [popups, popupsActiveFiltered]
  );

  if (!popups.length || (popupsActiveFiltered.length === 0 && !showSidebar)) {
    return undefined;
  }

  if (popupsFiltered.length === 0 && canHide) {
    return (
      <PopupSidebar
        placement={placementTabs}
        value={popupsActiveFiltered}
        multi={multi}
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
            value={popupsActiveFiltered}
            multi={multi}
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
          gap={0}
          multi={multi}
          defaultValue={popupsActiveFiltered.length > 0 ? popupsActiveFiltered.slice(0, 1) : [popups[0].id]}
        >
          {popupsFiltered.map((popup, i) => (
            <PopupSidePanelItem
              key={popup.id}
              className={i > 0 ? 'border-t border-solid border-gray-300' : ''}
              id={popup.id}
              title={popup.settings.title}
              placement={placement}
              size={size}
              allowFloatingSide={popup.settings.allowFloatingSide}
              onClickFloating={handleClickFloating}
              onClickCollapse={handleClickCollapse}
            />
          ))}
        </Accordion>
      </div>
    </ContainerResizable>
  );
};

export default memo(PopupSidePanel);
