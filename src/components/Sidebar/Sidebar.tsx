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
  placement?: 'top' | 'left' | 'right' | 'buttom';
  selected?: string;
  value?: string | string[];
  multi?: boolean;
  canEmpty?: boolean;
  onChange?: (item: string[]) => void;
} & useThemeSharedProps<typeof SidebarStyles, typeof variantKeys>;

const Sidebar = ({
  className,
  children,
  value = [],
  multi = false,
  canEmpty = false,
  placement,
  border,
  padding,
  size,
  onChange
}: SidebarProps) => {
  className = useTheme<typeof SidebarStyles, typeof variantKeys>('Sidebar', {
    className,
    componentKey: 'root',
    variant: { placement, border, padding, size }
  });

  const finalValue = useMemo(() => {
    if (typeof value === 'string' && value) {
      return [value];
    }

    if (typeof value === 'string') {
      return [];
    }

    return value;
  }, [value]);

  const handleChange = useCallback(
    (id: string) => {
      if (!onChange) {
        return;
      }

      const found = finalValue.includes(id);
      if (multi && found) {
        onChange(finalValue.filter(v => v !== id));
      } else if (multi) {
        onChange([...finalValue, id]);
      } else if (found && canEmpty) {
        onChange([]);
      } else if (!found) {
        onChange([id]);
      }
    },
    [canEmpty, multi, onChange, finalValue]
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
        const newIconProps = { size, ...iconProps, key: i, id: itemId };
        if (!iconProps.detatched) {
          newIconProps.active = finalValue.includes(itemId);
        }

        components.items.push(cloneElement<SidebarIconProps>(child as ReactElement<SidebarIconProps>, newIconProps));
      } else if (child.type === SidebarSeparator) {
        const separatorProps = child.props as SidebarSeparatorProps;
        components.items.push(
          cloneElement<SidebarSeparatorProps>(child as ReactElement<SidebarSeparatorProps>, {
            ...separatorProps,
            key: i
          })
        );
      } else {
        const childProps = child.props as object;
        components.items.push(cloneElement<unknown>(child as ReactElement, { ...childProps, key: i }));
      }
    });

    return components;
  }, [children, finalValue, size]);

  return (
    <div className={className}>
      <SidebarProvider onChange={handleChange}>{items}</SidebarProvider>
    </div>
  );
};

Sidebar.Icon = SidebarIcon;

Sidebar.Separator = SidebarSeparator;

export default Sidebar;
