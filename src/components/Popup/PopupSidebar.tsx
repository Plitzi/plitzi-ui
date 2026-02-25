import { cloneElement, isValidElement, memo, useCallback, useMemo } from 'react';

import Sidebar from '@components/Sidebar';
import SidebarIcon from '@components/Sidebar/SidebarIcon';
import useTheme from '@hooks/useTheme';

import usePopup from './hooks/usePopup';

import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { IconProps } from '@components/Icon';
import type { SidebarProps } from '@components/Sidebar';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement } from 'react';

export type PopupSidebarProps = {
  placement?: 'left' | 'right';
  canHide?: boolean;
  exclude?: string[];
  separatorsBefore?: string[];
} & Omit<SidebarProps, 'placement' | 'multi'> &
  useThemeSharedProps<typeof PopupStyles, Omit<typeof variantKeys, 'placement'>>;

const PopupSidebar = ({
  className = '',
  value,
  canEmpty = true,
  canHide = false,
  placement = 'right',
  exclude,
  separatorsBefore,
  border,
  padding,
  size = 'lg',
  onChange
}: PopupSidebarProps) => {
  className = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: 'sidebar',
    variants: { placement, size }
  });
  const { popups, multi } = usePopup(placement);

  const popupsMemoised = useMemo(
    () =>
      popups
        .filter(popup => !exclude?.length || !exclude.includes(popup.id))
        .map((popup, i) => {
          const child = popup.settings.icon;
          let childPopup;
          if (isValidElement(child) && child.type === SidebarIcon) {
            childPopup = cloneElement<IconProps>(child as ReactElement<IconProps>, {
              ...(child.props as IconProps),
              key: popup.id,
              id: popup.id
            });
          } else if (typeof child === 'string') {
            childPopup = (
              <Sidebar.Icon key={popup.id} id={popup.id} icon={child} title={popup.settings.title as string} />
            );
          } else {
            childPopup = (
              <Sidebar.Icon key={popup.id} id={popup.id} title={popup.settings.title as string}>
                {child}
              </Sidebar.Icon>
            );
          }
          if (separatorsBefore?.includes(popup.id) && i !== 0) {
            return [<Sidebar.Separator key={`${popup.id}-separator`} />, childPopup];
          }

          return childPopup;
        })
        .flat(),
    [exclude, popups, separatorsBefore]
  );

  const handleChange = useCallback((popups: string[]) => onChange?.(popups), [onChange]);

  if (canHide && !popups.length) {
    return undefined;
  }

  return (
    <Sidebar
      value={value}
      size={size}
      onChange={handleChange}
      canEmpty={canEmpty}
      multi={multi}
      className={className}
      placement={placement}
      border={border}
      padding={padding}
    >
      {popupsMemoised}
    </Sidebar>
  );
};

PopupSidebar.Icon = SidebarIcon;

export default memo(PopupSidebar);
