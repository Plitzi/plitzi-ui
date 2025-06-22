import useTheme from '@hooks/useTheme';

import type SidebarStyles from './Sidebar.styles';
import type { variantKeys } from './Sidebar.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type SidebarSeparatorProps = {} & useThemeSharedProps<typeof SidebarStyles, typeof variantKeys>;

const SidebarSeparator = ({ className }: SidebarSeparatorProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'separator'
  });

  return <div className={className} />;
};

export default SidebarSeparator;
