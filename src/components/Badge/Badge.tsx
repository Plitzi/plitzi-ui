import clsx from 'clsx';
import { useMemo } from 'react';

import useTheme from '@hooks/useTheme';

import type BadgeStyles from './Badge.styles';
import type { variantKeys } from './Badge.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type BadgeProps = {
  children?: ReactNode;
  icon?: string;
} & useThemeSharedProps<typeof BadgeStyles, typeof variantKeys>;

const Badge = ({ children, icon: iconProp = '', className = '', intent = 'success', solid, size }: BadgeProps) => {
  const classNameTheme = useTheme<typeof BadgeStyles, typeof variantKeys>('Badge', {
    className,
    componentKey: ['root', 'iconContainer', 'content', 'icon'],
    variants: { intent, size, solid }
  });

  const icon = useMemo(() => {
    if (iconProp) {
      return iconProp;
    }

    switch (intent) {
      case 'success':
        return 'fas fa-check';
      case 'error':
        return 'fas fa-fire';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      case 'default':
      default:
        return '';
    }
  }, [intent, iconProp]);

  return (
    <div className={classNameTheme.root}>
      {icon && (
        <div className={classNameTheme.iconContainer}>
          <i className={clsx(icon, classNameTheme.icon)} />
        </div>
      )}
      <div className={classNameTheme.content}>{children}</div>
    </div>
  );
};

export default Badge;
