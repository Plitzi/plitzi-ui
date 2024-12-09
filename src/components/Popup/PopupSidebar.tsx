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
import type { variantKeys as variantKeysSidebar } from '@components/Sidebar/Sidebar.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

const popupsActiveDefault: string[] = [];

export type PopupSidebarProps = {
  className?: string;
  popupsActive?: string[];
  canHide?: boolean;
  multiSelect?: boolean;
  placement?: 'left' | 'right';
  onChange?: (popups: string[]) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys & Omit<typeof variantKeysSidebar, 'placement'>>;

const PopupSidebar = ({
  className = '',
  popupsActive = popupsActiveDefault,
  canHide = true,
  multiSelect = true,
  placement = 'right',
  border,
  padding,
  onChange
}: PopupSidebarProps) => {
  className = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: 'sidebar',
    variant: { placement }
  });
  const { popupLeft, popupRight } = usePopup();
  const popups = useMemo(() => {
    if (placement === 'left') {
      return popupLeft;
    }

    return popupRight;
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
      border={border}
      padding={padding}
    >
      {popups.map((popup, i) => (
        <Sidebar.Icon key={i} id={popup.id}>
          {popup.settings.icon}
        </Sidebar.Icon>
      ))}
    </Sidebar>
  );
};

export default PopupSidebar;
