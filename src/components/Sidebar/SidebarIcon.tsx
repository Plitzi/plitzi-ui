import { use, useCallback } from 'react';

import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import SidebarContext from './SidebarContext';

import type SidebarStyles from './Sidebar.styles';
import type { variantKeys } from './Sidebar.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { KeyboardEvent, MouseEvent } from 'react';

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
  title,
  ...props
}: SidebarIconProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'icon',
    variants: { size, active }
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

  // A rail's button is one to a keyboard and to a screen reader too: Enter and Space press it, as a click does.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'Enter' && e.key !== ' ') {
        return;
      }

      e.preventDefault();
      if (detatched) {
        return;
      }

      if (id && onChange) {
        onChange(id);
      }
    },
    [detatched, id, onChange]
  );

  return (
    <Icon
      className={className}
      size={size}
      cursor="pointer"
      intent={active ? 'primary' : 'tertiary'}
      active={active}
      role="button"
      tabIndex={0}
      title={title}
      aria-label={title}
      aria-pressed={active}
      onKeyDown={handleKeyDown}
      {...props}
      onClick={handleClick}
    >
      {children}
    </Icon>
  );
};

export default SidebarIcon;
