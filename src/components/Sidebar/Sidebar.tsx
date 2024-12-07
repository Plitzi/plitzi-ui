// Packages
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import SidebarIcon from './SidebarIcon';
import SidebarProvider from './SidebarProvider';
import SidebarSeparator from './SidebarSeparator';

// Types
import type SidebarStyles from './Sidebar.styles';
import type { variantKeys } from './Sidebar.styles';
import type { SidebarIconProps } from './SidebarIcon';
import type { SidebarSeparatorProps } from './SidebarSeparator';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode } from 'react';

export type SidebarProps = {
  children?: ReactNode;
  placement?: 'top' | 'left' | 'right';
  selected?: string;
  value?: string[];
  multi?: boolean;
  canEmpty?: boolean;
  onChange?: (item: string[]) => void;
} & useThemeSharedProps<typeof SidebarStyles, typeof variantKeys>;

const Sidebar = ({
  className,
  children,
  placement,
  value = [],
  multi = false,
  canEmpty = false,
  onChange
}: SidebarProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'root',
    variant: { placement }
  });

  const handleChange = useCallback(
    (id: string) => {
      if (!onChange) {
        return;
      }

      const found = value.includes(id);
      if (multi && found) {
        onChange(value.filter(v => v !== id));
      } else if (multi) {
        onChange([...value, id]);
      } else if (found && canEmpty) {
        onChange([]);
      } else if (!found) {
        onChange([id]);
      }
    },
    [canEmpty, multi, onChange, value]
  );

  const { items } = useMemo(() => {
    const components: { items: ReactNode[] } = {
      items: []
    };

    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === SidebarIcon) {
        const iconProps = child.props as SidebarIconProps;
        const itemId = iconProps.id ?? i.toString();
        components.items.push(
          cloneElement<SidebarIconProps>(child as ReactElement<SidebarIconProps>, {
            key: i,
            ...iconProps,
            active: value.includes(itemId),
            id: itemId
          })
        );
      } else if (child.type === SidebarSeparator) {
        const separatorProps = child.props as SidebarSeparatorProps;
        components.items.push(
          cloneElement<SidebarSeparatorProps>(child as ReactElement<SidebarSeparatorProps>, {
            key: i,
            ...separatorProps
          })
        );
      }
    });

    return components;
  }, [children, value]);

  return (
    <div className={className}>
      <SidebarProvider onChange={handleChange}>{items}</SidebarProvider>
    </div>
  );
};

Sidebar.Icon = SidebarIcon;

Sidebar.Separator = SidebarSeparator;

export default Sidebar;
