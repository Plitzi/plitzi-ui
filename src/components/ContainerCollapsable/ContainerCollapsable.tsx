// Packages
import { Children, cloneElement, isValidElement, useCallback, useMemo, useState } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import ContainerCollapsableContent from './ContainerCollapsableContent';
import ContainerCollapsableHeader from './ContainerCollapsableHeader';

// Types
import type ContainerCollapsableStyles from './ContainerCollapsable.styles';
import type { variantKeys } from './ContainerCollapsable.styles';
import type { ContainerCollapsableHeaderProps } from './ContainerCollapsableHeader';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEventHandler, ReactElement, ReactNode } from 'react';

export type ContainerCollapsableProps = {
  collapsed?: boolean;
  autoGrow?: boolean;
  children?: ReactNode;
  onChange?: (collapsed: boolean) => void;
} & useThemeSharedProps<typeof ContainerCollapsableStyles, typeof variantKeys>;

const ContainerCollapsable = ({
  className = '',
  collapsed: collapsedProp = false,
  autoGrow = false,
  children,
  onChange
}: ContainerCollapsableProps) => {
  const [collapsed, setCollapsed] = useState(collapsedProp);
  const classNameTheme = useTheme<typeof ContainerCollapsableStyles, typeof variantKeys, false>(
    'ContainerCollapsable',
    { className, componentKey: ['root'], variant: { grow: autoGrow ? !collapsed : false } }
  );

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      e.stopPropagation();
      setCollapsed(!collapsed);
      onChange?.(!collapsed);
    },
    [collapsed, onChange]
  );

  const { header, content } = useMemo(() => {
    const components: { header?: ReactNode; content?: ReactNode } = { header: undefined, content: undefined };
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ContainerCollapsableHeader) {
        components.header = cloneElement<ContainerCollapsableHeaderProps>(
          child as ReactElement<ContainerCollapsableHeaderProps>,
          { ...(child.props as ContainerCollapsableHeaderProps), collapsed, onClick: handleClick }
        );
      } else if (child.type === ContainerCollapsableContent) {
        components.content = cloneElement(child);
      }
    });

    return components;
  }, [children, collapsed, handleClick]);

  return (
    <div className={classNameTheme.root}>
      {header}
      {!collapsed && content}
    </div>
  );
};

ContainerCollapsable.Header = ContainerCollapsableHeader;
ContainerCollapsable.Content = ContainerCollapsableContent;

export default ContainerCollapsable;
