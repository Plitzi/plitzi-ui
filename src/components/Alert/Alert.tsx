import classNames from 'classnames';

import useTheme from '@hooks/useTheme';

import type AlertStyles from './Alert.styles';
import type { variantKeys } from './Alert.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type AlertProps = {
  children?: React.ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  intent?: 'success' | 'error' | 'warning' | 'info';
} & useThemeSharedProps<typeof AlertStyles, typeof variantKeys>;

const Alert = ({ children, className = '', iconClassName = '', intent = 'success', size }: AlertProps) => {
  const classNameTheme = useTheme<typeof AlertStyles, typeof variantKeys>('Alert', {
    className,
    componentKey: ['root', 'iconContainer', 'content'],
    variants: { intent, size }
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
    </div>
  );
};

export default Alert;
