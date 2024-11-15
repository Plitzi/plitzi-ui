// Packages
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type AlertStyles from './Alert.styles';
import type { variantKeys } from './Alert.styles';

export const ALERT_INTENT_SUCCESS = 'success';
export const ALERT_INTENT_ERROR = 'error';
export const ALERT_INTENT_WARNING = 'warning';
export const ALERT_INTENT_INFO = 'info';

export type AlertProps = {
  children?: React.ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  intent?: 'success' | 'error' | 'warning' | 'info';
} & useThemeSharedProps<typeof variantKeys>;

const Alert = ({
  children,
  className = '',
  containerClassName = '',
  iconClassName = 'fa-2x',
  intent = ALERT_INTENT_SUCCESS
}: AlertProps) => {
  const classNameTheme = useTheme<typeof AlertStyles, typeof variantKeys, false>({
    className,
    componentKey: ['Alert.root'],
    variant: { intent }
  });

  return (
    <div className={classNameTheme.root}>
      <div className={classNames('flex m-4 grow justify-center', containerClassName)}>
        <div className="flex mr-4">
          {intent === ALERT_INTENT_SUCCESS && <i className={classNames('fas fa-check', iconClassName)} />}
          {intent === ALERT_INTENT_ERROR && <i className={classNames('fas fa-fire', iconClassName)} />}
          {intent === ALERT_INTENT_WARNING && (
            <i className={classNames('fas fa-exclamation-triangle', iconClassName)} />
          )}
          {intent === ALERT_INTENT_INFO && <i className={classNames('fas fa-info-circle', iconClassName)} />}
        </div>
        <div className="grow basis-0 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
