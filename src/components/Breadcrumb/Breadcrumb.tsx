/* eslint-disable quotes */
import clsx from 'clsx';
import { Fragment } from 'react';

import useTheme from '@hooks/useTheme';

import BreadcrumbItem from './BreadcrumbItem';

import type BreadcrumbStyles from './Breadcrumb.styles';
import type { variantKeys } from './Breadcrumb.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type BreadcrumbProps = {
  children?: ReactNode;
  classNameItem?: string;
  separator?: '>' | '/' | '\\';
  onItemClick?: (index: number) => void;
} & useThemeSharedProps<typeof BreadcrumbStyles, typeof variantKeys>;

const Breadcrumb = ({ children, className = '', separator = '>', intent, size, onItemClick }: BreadcrumbProps) => {
  const classNameTheme = useTheme<typeof BreadcrumbStyles, typeof variantKeys>('Breadcrumb', {
    className,
    componentKey: ['root', 'list', 'separator'],
    variants: { intent, size }
  });

  return (
    <div className={classNameTheme.root}>
      {Array.isArray(children) &&
        children.map((child, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div
                className={clsx(classNameTheme.separator, {
                  "not-first:before:content-['>']": separator === '>',
                  "not-first:before:content-['/']": separator === '/',
                  "not-first:before:content-['\\']": separator === '\\'
                })}
              />
            )}
            <BreadcrumbItem
              className={classNameTheme.listItem}
              index={i}
              intent={intent}
              size={size}
              onClick={onItemClick}
            >
              {child}
            </BreadcrumbItem>
          </Fragment>
        ))}
    </div>
  );
};

export default Breadcrumb;
