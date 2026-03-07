import { memo, use, useCallback } from 'react';

import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';

import usePopup from './hooks/usePopup';
import Popup from './Popup';

import type { PopupPlacement } from './Popup';

export type PopupFloatingAreaProps = {
  className?: string;
};
const PopupFloatingArea = ({ className = '' }: PopupFloatingAreaProps) => {
  const { rootRef } = use(ContainerRootContext);
  const { popupManager, popups, removePopup, limitMode } = usePopup('floating');

  const handleChangePlacement = useCallback(
    (id: string, placement: PopupPlacement) => popupManager.move(id, undefined, placement),
    [popupManager]
  );

  const handleFocus = useCallback((id: string) => popupManager.focusFloating(id), [popupManager]);

  if (!popups.length) {
    return undefined;
  }

  return (
    <div className={className}>
      {popups.map(popup => {
        const { title } = popup.settings;

        return (
          <Popup
            {...popup.settings}
            key={popup.id}
            id={popup.id}
            title={title}
            parentRef={rootRef}
            limitMode={limitMode}
            placementPopup={handleChangePlacement}
            onFocus={handleFocus}
            removePopup={removePopup}
          >
            {popup.component}
          </Popup>
        );
      })}
    </div>
  );
};

export default memo(PopupFloatingArea);
