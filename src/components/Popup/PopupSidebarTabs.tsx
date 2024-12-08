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
  placement?: 'top' | 'left' | 'right' | 'none';
  popupsActive?: string[];
  canHide?: boolean;
  multiSelect?: boolean;
  onChange?: (popups: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidebarTabs = ({
  className = '',
  placement = 'right',
  popupsActive = popupsActiveDefault,
  canHide = true,
  multiSelect = true,
  onChange
}: PopupSidebarTabsProps) => {
  className = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: 'tabs',
    variant: { placement }
  });
  const { popupLeft, popupRight } = usePopup();
  const popups = useMemo(() => {
    if (placement === 'left') {
      return popupLeft;
    }

    if (placement === 'right') {
      return popupRight;
    }

    return [];
  }, [placement, popupLeft, popupRight]);

  const handleChange = useCallback((popups: string[]) => onChange?.(popups), [onChange]);

  return (
    <Sidebar
      value={popupsActive}
      onChange={handleChange}
      canEmpty={canHide}
      multi={multiSelect}
      className={className}
      placement={placement as Partial<SidebarProps['placement']>}
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
