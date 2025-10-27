import useTheme from '@hooks/useTheme';

import type ContainerCollapsableStyles from './ContainerCollapsable.styles';
import type { variantKeys } from './ContainerCollapsable.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export type ContainerCollapsableHeaderProps = {
  children?: ReactNode;
  title?: ReactNode;
  placement?: 'left' | 'right';
  collapsed?: boolean;
  iconCollapsed?: ReactNode;
  iconExpanded?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'title'> &
  useThemeSharedProps<typeof ContainerCollapsableStyles, typeof variantKeys>;

const iconCollapsedDefault = <i className="fas fa-plus" />;
const iconExpandedDefault = <i className="fas fa-minus" />;

const ContainerCollapsableHeader = ({
  children,
  className,
  title = 'Title',
  collapsed = false,
  iconCollapsed = iconCollapsedDefault,
  iconExpanded = iconExpandedDefault,
  placement = 'left',
  onClick,
  ...otherProps
}: ContainerCollapsableHeaderProps) => {
  const classNameTheme = useTheme<typeof ContainerCollapsableStyles, typeof variantKeys>('ContainerCollapsable', {
    className,
    componentKey: [
      'header',
      'headerContainer',
      'headerTitle',
      'headerIconContainer',
      'headerSlot',
      'headerSlotContainer'
    ]
  });

  return (
    <div className={classNameTheme.header} onClick={onClick} {...otherProps}>
      <div className={classNameTheme.headerContainer}>
        {placement === 'left' && (
          <div className={classNameTheme.headerIconContainer}>
            {collapsed && iconCollapsed}
            {!collapsed && iconExpanded}
          </div>
        )}
        <div className={classNameTheme.headerTitle}>{title}</div>
      </div>
      <div className={classNameTheme.headerSlotContainer}>
        <div className={classNameTheme.headerSlot}>{children}</div>
        {placement === 'right' && (
          <div className={classNameTheme.headerIconContainer}>
            {collapsed && iconCollapsed}
            {!collapsed && iconExpanded}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerCollapsableHeader;
