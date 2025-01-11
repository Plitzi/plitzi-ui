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
  detatched?: boolean;
} & Omit<IconProps, 'size'> &
  useThemeSharedProps<typeof SidebarStyles, typeof variantKeys>;

const SidebarIcon = ({
  children,
  id,
  className,
  active = false,
  detatched = false,
  size,
  onClick,
  ...props
}: SidebarIconProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'icon',
    variant: { size }
  });
  const { onChange } = use(SidebarContext);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (detatched || e.isPropagationStopped() || e.isDefaultPrevented()) {
        return;
      }

      if (id && onChange) {
        onChange(id);
      }
    },
    [onClick, detatched, id, onChange]
  );

  return (
    <Icon
      className={className}
      size={size as Partial<IconProps['size']>}
      cursor="pointer"
      intent={active ? 'primary' : 'tertiary'}
      active={active}
      {...props}
      onClick={handleClick}
    >
      {children}
    </Icon>
  );
};

export default SidebarIcon;
