import useTheme from '@hooks/useTheme';

import type ErrorMessageStyles from './ErrorMessage.styles';
import type { variantKeys } from './ErrorMessage.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type ErrorMessageProps = {
  id?: string;
  message?: string;
  disabled?: boolean;
  error?: boolean;
} & useThemeSharedProps<typeof ErrorMessageStyles, typeof variantKeys>;

const ErrorMessage = ({ className, id, message, disabled = false, error = false, intent, size }: ErrorMessageProps) => {
  className = useTheme<typeof ErrorMessageStyles, typeof variantKeys>('ErrorMessage', {
    className,
    componentKey: 'root',
    variants: { intent, size, error, disabled }
  });

  return (
    <p id={id} className={className}>
      {message}
    </p>
  );
};

export default ErrorMessage;
