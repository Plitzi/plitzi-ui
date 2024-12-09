// Packages
import { useCallback, useMemo } from 'react';

// Alias
import Sidebar from '@components/Sidebar';
import useTheme from '@hooks/useTheme';

// Relatives
import usePopup from './usePopup';

// Types
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { SidebarProps } from '@components/Sidebar';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type PopupSidebarProps = {
  placement?: 'left' | 'right';
} & Omit<SidebarProps, 'placement'> &
  useThemeSharedProps<typeof PopupStyles, Omit<typeof variantKeys, 'placement'>>;

const PopupSidebar = ({
  className = '',
  value,
  canEmpty = true,
  multi = true,
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
      value={value}
      onChange={handleChange}
      canEmpty={canEmpty}
      multi={multi}
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
