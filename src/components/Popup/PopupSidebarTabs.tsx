// Packages
import { useCallback, useMemo } from 'react';

// Alias
import Sidebar, { SidebarProps } from '@components/Sidebar';
import useTheme from '@hooks/useTheme';

// Relatives
import usePopup from './usePopup';

// Types
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

const popupsActiveDefault: string[] = [];

export type PopupSidebarTabsProps = {
  className?: string;
  placementTabs?: 'top' | 'left' | 'right' | 'none';
  popupsActive?: string[];
  canHide?: boolean;
  multiSelect?: boolean;
  onChange?: (popups: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidebarTabs = ({
  className = '',
  placementTabs = 'right',
  popupsActive = popupsActiveDefault,
  canHide = true,
  multiSelect = true,
  onChange
}: PopupSidebarTabsProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys, false>('Popup', {
    className,
    componentKey: ['tabs'],
    variant: { placement: placementTabs }
  });
  const { popupLeft, popupRight } = usePopup();
  const popups = useMemo(() => {
    if (placementTabs === 'left') {
      return popupLeft;
    }

    if (placementTabs === 'right') {
      return popupRight;
    }

    return [];
  }, [placementTabs, popupLeft, popupRight]);

  // const handleClickPopup = (popupId: string) => () => placementPopup?.(popupId)('floating');

  const handleChange = useCallback((popups: string[]) => onChange?.(popups), [onChange]);

  if (!popups.length) {
    return undefined;
  }

  return (
    <Sidebar
      value={popupsActive}
      onChange={handleChange}
      canEmpty={canHide}
      multi={multiSelect}
      className={classNameTheme.tabs}
      placement={placementTabs as Partial<SidebarProps['placement']>}
    >
      {popups.map((popup, i) => (
        <Sidebar.Icon key={i} id={popup.id}>
          {popup.settings.icon}
        </Sidebar.Icon>
      ))}
    </Sidebar>
  );
};

export default PopupSidebarTabs;
