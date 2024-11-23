// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type ErrorMessageStyles from './ErrorMessage.styles';
import type { variantKeys } from './ErrorMessage.styles';

export type ErrorMessageProps = {
  message?: string;
  disabled?: boolean;
  hasError?: boolean;
} & useThemeSharedProps<typeof ErrorMessageStyles, typeof variantKeys>;

const ErrorMessage = ({ className, message, disabled = false, hasError = false, intent, size }: ErrorMessageProps) => {
  className = useTheme<typeof ErrorMessageStyles, typeof variantKeys>('ErrorMessage', {
    className,
    componentKey: 'root',
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  return <p className={className}>{message}</p>;
};

export default ErrorMessage;
