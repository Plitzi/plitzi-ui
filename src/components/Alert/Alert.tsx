import classNames from 'classnames';

import useTheme from '@hooks/useTheme';

import type AlertStyles from './Alert.styles';
import type { variantKeys } from './Alert.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export const ALERT_INTENT_SUCCESS = 'success';
export const ALERT_INTENT_ERROR = 'error';
export const ALERT_INTENT_WARNING = 'warning';
export const ALERT_INTENT_INFO = 'info';

export type AlertProps = {
  children?: React.ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  intent?: 'success' | 'error' | 'warning' | 'info';
} & useThemeSharedProps<typeof AlertStyles, typeof variantKeys>;

const Alert = ({ children, className = '', iconClassName = '', intent = ALERT_INTENT_SUCCESS, size }: AlertProps) => {
  const classNameTheme = useTheme<typeof AlertStyles, typeof variantKeys>('Alert', {
    className,
    componentKey: ['root', 'iconContainer', 'content'],
    variants: { intent, size }
  });

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.iconContainer}>
        {intent === ALERT_INTENT_SUCCESS && <i className={classNames('fas fa-check', iconClassName)} />}
        {intent === ALERT_INTENT_ERROR && <i className={classNames('fas fa-fire', iconClassName)} />}
        {intent === ALERT_INTENT_WARNING && <i className={classNames('fas fa-exclamation-triangle', iconClassName)} />}
        {intent === ALERT_INTENT_INFO && <i className={classNames('fas fa-info-circle', iconClassName)} />}
      </div>
      <div className={classNameTheme.content}>{children}</div>
    </div>
  );
};

export default Alert;
