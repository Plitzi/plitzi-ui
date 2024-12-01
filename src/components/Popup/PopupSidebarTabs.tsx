// Packages
import classNames from 'classnames';
import noop from 'lodash/noop';
import { useMemo } from 'react';

// Relatives
import usePopup from './usePopup';

const popupsActiveDefault: string[] = [];

export type PopupSidebarTabsProps = {
  className?: string;
  placementTabs?: 'top' | 'left' | 'right' | 'none';
  popupsActive?: string[];
  onTabClick?: (popupId: string) => void;
};

const PopupSidebarTabs = ({
  className = '',
  placementTabs = 'right',
  popupsActive = popupsActiveDefault,
  onTabClick = noop
}: PopupSidebarTabsProps) => {
  const { placementPopup, popupLeft, popupRight, removePopup } = usePopup();
  const popups = useMemo(() => {
    if (placementTabs === 'left') {
      return popupLeft;
    }

    if (placementTabs === 'right') {
      return popupRight;
    }

    return [];
  }, [placementTabs, popupLeft, popupRight]);

  const handleClickPopup = (popupId: string) => () => placementPopup?.(popupId)('floating');

  const handleClickFocusPopup = (popupId: string) => () => onTabClick(popupId);

  if (!popups.length) {
    return undefined;
  }

  return (
    <ul
      className={classNames('m-0 p-0 flex list-none', className, {
        'bg-gray-300': placementTabs === 'top',
        'bg-gray-700': placementTabs !== 'top',
        '[writing-mode:vertical-lr] [text-orientation:mixed] items-center':
          placementTabs === 'right' || placementTabs === 'left',
        'rotate-180': placementTabs === 'left',
        'justify-end': placementTabs === 'right'
      })}
    >
      {popups.map((popup, i) => {
        const { icon, title, allowLeftSide } = popup.settings;
        const isActive = popupsActive.includes(popup.id);

        return (
          <li
            key={i}
            className={classNames('relative flex items-center cursor-pointer overflow-hidden select-none', {
              'px-2 py-1 grow border-r border-gray-300 first:last:border-b last:border-r-0': placementTabs === 'top',
              'px-1 py-4 text-white': placementTabs !== 'top',
              'bg-white': isActive && placementTabs === 'top',
              'bg-gray-600': isActive && placementTabs !== 'top'
            })}
            onClick={handleClickFocusPopup(popup.id)}
          >
            <label className="m-0 gap-1 flex justify-center items-center grow basis-0 text-sm cursor-pointer text-center truncate">
              {icon}
              {title}
            </label>
            {allowLeftSide && (
              <span
                className={classNames('flex', { 'ml-2': placementTabs === 'top', 'mt-2': placementTabs !== 'top' })}
                onClick={handleClickPopup(popup.id)}
              >
                <i className="fas fa-caret-square-left" />
              </span>
            )}
            <span
              className={classNames('flex', { 'ml-2': placementTabs === 'top', 'mt-2': placementTabs !== 'top' })}
              onClick={removePopup?.(popup.id)}
            >
              <i className="fas fa-times" />
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default PopupSidebarTabs;
