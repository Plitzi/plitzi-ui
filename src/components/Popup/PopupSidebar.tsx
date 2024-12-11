// Packages
import { memo, useCallback } from 'react';

// Alias
import { emptyArray } from '@/helpers/utils';
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
  canHide?: boolean;
  exclude?: string[];
} & Omit<SidebarProps, 'placement'> &
  useThemeSharedProps<typeof PopupStyles, Omit<typeof variantKeys, 'placement'>>;

const PopupSidebar = ({
  className = '',
  value,
  canEmpty = true,
  canHide = false,
  multi = true,
  placement = 'right',
  exclude = emptyArray,
  border,
  padding,
  onChange
}: PopupSidebarProps) => {
  className = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: 'sidebar',
    variant: { placement }
  });
  const { popups } = usePopup(placement);

  const handleChange = useCallback((popups: string[]) => onChange?.(popups), [onChange]);

  if (canHide && !popups.length) {
    return undefined;
  }

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
      {popups
        .filter(popup => !exclude.length || !exclude.includes(popup.id))
        .map((popup, i) => (
          <Sidebar.Icon key={i} id={popup.id}>
            {popup.settings.icon}
          </Sidebar.Icon>
        ))}
    </Sidebar>
  );
};

export default memo(PopupSidebar);
