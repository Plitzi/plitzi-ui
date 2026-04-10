import { useCallback } from 'react';

import useTheme from '@hooks/useTheme';

import type BreadcrumbStyles from './Breadcrumb.styles';
import type { variantKeys } from './Breadcrumb.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type BreadcrumbItemProps = {
  children?: ReactNode;
  index: number;
  onClick?: (index: number) => void;
} & useThemeSharedProps<typeof BreadcrumbStyles, typeof variantKeys>;

const BreadcrumbItem = ({ children, className = '', index, intent, size, onClick }: BreadcrumbItemProps) => {
  className = useTheme<typeof BreadcrumbStyles, typeof variantKeys>('Breadcrumb', {
    className,
    componentKey: 'listItem',
    variants: { intent, size }
  });

  const handleClick = useCallback(() => onClick?.(index), [index, onClick]);

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default BreadcrumbItem;
