import classNames from 'classnames';

import useTheme from '@hooks/useTheme';

import type AlertStyles from './Alert.styles';
import type { variantKeys } from './Alert.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type AlertProps = {
  children?: ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  closeable?: boolean;
  onClick?: () => void;
} & useThemeSharedProps<typeof AlertStyles, typeof variantKeys>;

const Alert = ({
  children,
  className = '',
  iconClassName = '',
  intent = 'success',
  solid,
  size,
  closeable = false,
  onClick
}: AlertProps) => {
  const classNameTheme = useTheme<typeof AlertStyles, typeof variantKeys>('Alert', {
    className,
    componentKey: ['root', 'iconContainer', 'content', 'closeIconContainer'],
    variants: { intent, size, solid }
  });

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.iconContainer}>
        {intent === 'success' && <i className={classNames('fas fa-check', iconClassName)} />}
        {intent === 'error' && <i className={classNames('fas fa-fire', iconClassName)} />}
        {intent === 'warning' && <i className={classNames('fas fa-exclamation-triangle', iconClassName)} />}
        {intent === 'info' && <i className={classNames('fas fa-info-circle', iconClassName)} />}
      </div>
      <div className={classNameTheme.content}>{children}</div>
      {closeable && (
        <div className={classNameTheme.closeIconContainer}>
          <i className={classNames('fa-solid fa-xmark', iconClassName)} onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export default Alert;
