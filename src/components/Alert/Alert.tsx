import clsx from 'clsx';

import useTheme from '@hooks/useTheme';

import type AlertStyles from './Alert.styles';
import type { variantKeys } from './Alert.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type AlertProps = {
  children?: ReactNode;
  closeable?: boolean;
  onClick?: () => void;
} & useThemeSharedProps<typeof AlertStyles, typeof variantKeys>;

const Alert = ({
  children,
  className = '',
  intent = 'success',
  solid,
  size,
  closeable = false,
  onClick
}: AlertProps) => {
  const classNameTheme = useTheme<typeof AlertStyles, typeof variantKeys>('Alert', {
    className,
    componentKey: ['root', 'iconContainer', 'icon', 'content', 'closeIconContainer'],
    variants: { intent, size, solid }
  });

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.iconContainer}>
        {intent === 'success' && <i className={clsx('fas fa-check', classNameTheme.icon)} />}
        {intent === 'error' && <i className={clsx('fas fa-fire', classNameTheme.icon)} />}
        {intent === 'warning' && <i className={clsx('fas fa-exclamation-triangle', classNameTheme.icon)} />}
        {intent === 'info' && <i className={clsx('fas fa-info-circle', classNameTheme.icon)} />}
      </div>
      <div className={classNameTheme.content}>{children}</div>
      {closeable && (
        <div className={classNameTheme.closeIconContainer}>
          <i className={clsx('fa-solid fa-xmark', classNameTheme.icon)} onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export default Alert;
