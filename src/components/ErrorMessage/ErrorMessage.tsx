import useTheme from '@hooks/useTheme';

import type ErrorMessageStyles from './ErrorMessage.styles';
import type { variantKeys } from './ErrorMessage.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type ErrorMessageProps = {
  message?: string;
  disabled?: boolean;
  error?: boolean;
} & useThemeSharedProps<typeof ErrorMessageStyles, typeof variantKeys>;

const ErrorMessage = ({ className, message, disabled = false, error = false, intent, size }: ErrorMessageProps) => {
  className = useTheme<typeof ErrorMessageStyles, typeof variantKeys>('ErrorMessage', {
    className,
    componentKey: 'root',
    variants: { intent, size, error, disabled }
  });

  return <p className={className}>{message}</p>;
};

export default ErrorMessage;
