// Packages
import { use } from 'react';

// Alias
import ContainerRootContext from '@components/ContainerRoot/ContainerRootContext';

// Relatives
import Popup from './Popup';
import usePopup from './usePopup';

export type PopupFloatingAreaProps = {
  className?: string;
};
const PopupFloatingArea = ({ className = '' }: PopupFloatingAreaProps) => {
  const { rootDOM } = use(ContainerRootContext);
  const { placementPopup, popupFloating, removePopup, focusPopup, limitMode } = usePopup();
  if (!popupFloating.length) {
    return undefined;
  }

  return (
    <div className={className}>
      {popupFloating.map(popup => {
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

export default PopupFloatingArea;
