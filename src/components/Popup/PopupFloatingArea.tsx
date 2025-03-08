import { memo, use } from 'react';

import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';

import Popup from './Popup';
import usePopup from './usePopup';

export type PopupFloatingAreaProps = {
  className?: string;
};
const PopupFloatingArea = ({ className = '' }: PopupFloatingAreaProps) => {
  const { rootDOM } = use(ContainerRootContext);
  const { placementPopup, popups, removePopup, focusPopup, limitMode } = usePopup('floating');
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
            placementPopup={placementPopup}
            onFocus={focusPopup}
            removePopup={removePopup}
            limitMode={limitMode}
            parentElement={rootDOM}
          >
            {popup.component}
          </Popup>
        );
      })}
    </div>
  );
};

export default memo(PopupFloatingArea);
