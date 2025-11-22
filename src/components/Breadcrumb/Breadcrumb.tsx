/* eslint-disable quotes */
import clsx from 'clsx';

import useTheme from '@hooks/useTheme';

import type BreadcrumbStyles from './Breadcrumb.styles';
import type { variantKeys } from './Breadcrumb.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type BreadcrumbProps = {
  children?: ReactNode;
  classNameItem?: string;
  separator?: '>' | '/' | '\\';
} & useThemeSharedProps<typeof BreadcrumbStyles, typeof variantKeys>;

const Breadcrumb = ({
  children,
  classNameItem = '',
  className = '',
  separator = '>',
  intent,
  intentSeparator,
  size
}: BreadcrumbProps) => {
  const classNameTheme = useTheme<typeof BreadcrumbStyles, typeof variantKeys>('Breadcrumb', {
    className,
    componentKey: ['root', 'list', 'listItem'],
    variants: { intent, size, intentSeparator }
  });

  return (
    <div className={classNameTheme.root}>
      {Array.isArray(children) &&
        children.map((child, i) => (
          <div
            key={i}
            className={clsx(
              classNameTheme.listItem,
              {
                "[&:not(:first-child)]:before:content-['>']": separator === '>',
                "[&:not(:first-child)]:before:content-['/']": separator === '/',
                "[&:not(:first-child)]:before:content-['\\']": separator === '\\'
              },
              classNameItem
            )}
          >
            {child}
          </div>
        ))}
    </div>
  );
};

export default Breadcrumb;
