import classNames from 'classnames';

import useTheme from '@hooks/useTheme';

import type BadgeStyles from './Badge.styles';
import type { variantKeys } from './Badge.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type BadgeProps = {
  children?: ReactNode;
} & useThemeSharedProps<typeof BadgeStyles, typeof variantKeys>;

const Badge = ({ children, className = '', intent = 'success', solid, size }: BadgeProps) => {
  const classNameTheme = useTheme<typeof BadgeStyles, typeof variantKeys>('Badge', {
    className,
    componentKey: ['root', 'iconContainer', 'content', 'icon'],
    variants: { intent, size, solid }
  });

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.iconContainer}>
        {intent === 'success' && <i className={classNames('fas fa-check', classNameTheme.icon)} />}
        {intent === 'error' && <i className={classNames('fas fa-fire', classNameTheme.icon)} />}
        {intent === 'warning' && <i className={classNames('fas fa-exclamation-triangle', classNameTheme.icon)} />}
        {intent === 'info' && <i className={classNames('fas fa-info-circle', classNameTheme.icon)} />}
      </div>
      <div className={classNameTheme.content}>{children}</div>
    </div>
  );
};

export default Badge;
