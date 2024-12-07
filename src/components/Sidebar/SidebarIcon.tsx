// Packages
import { use, useCallback } from 'react';

// Alias
import Icon, { IconProps } from '@components/Icon';
import useTheme from '@hooks/useTheme';

// Relatives
import SidebarContext from './SidebarContext';

// Types
import type SidebarStyles from './Sidebar.styles';
import type { variantKeys } from './Sidebar.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent } from 'react';

export type SidebarIconProps = {
  id?: string;
} & IconProps &
  useThemeSharedProps<typeof SidebarStyles, typeof variantKeys>;

const SidebarIcon = ({ children, id, className, active = false, onClick, ...props }: SidebarIconProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'icon',
    variant: {}
  });
  const { onChange } = use(SidebarContext);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (id && onChange) {
        onChange(id);
      }
    },
    [onClick, id, onChange]
  );

  return (
    <Icon
      className={className}
      size="lg"
      cursor="pointer"
      intent="tertiary"
      active={active}
      {...props}
      onClick={handleClick}
    >
      {children}
    </Icon>
  );
};

export default SidebarIcon;
