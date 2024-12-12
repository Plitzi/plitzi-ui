// Packages
import classNames from 'classnames';
import { useCallback } from 'react';

// Alias
import ErrorMessage from '@components/ErrorMessage';
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

// Types
import type TextAreaStyles from './TextArea.styles';
import type { variantKeys } from './TextArea.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { LabelProps } from '@components/Label';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react';

export type TextAreaProps = {
  ref?: Ref<HTMLTextAreaElement>;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  value?: string;
  error?: ErrorMessageProps['message'];
  onChange?: (value: string) => void;
} & Pick<LabelProps, 'label'> &
  Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof TextAreaStyles, typeof variantKeys>;

const TextArea = ({
  ref,
  className = '',
  label = 'Text Area',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  hasError = false,
  size = 'md',
  intent = 'default',
  value = '',
  error = '',
  onChange,
  ...textareaProps
}: TextAreaProps) => {
  const classNameTheme = useTheme<typeof TextAreaStyles, typeof variantKeys, false>('TextArea', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'iconFloatingContainer', 'iconError'],
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={classNameTheme.root}>
      <Label label={label} hasError={hasError} disabled={disabled} intent={intent} size={size} />
      <div className={classNameTheme.inputContainer}>
        <textarea
          ref={ref}
          placeholder={placeholder}
          className={classNameTheme.input}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          {...(textareaProps as React.JSX.IntrinsicElements['textarea'])}
        />
        {(hasError || loading) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {!disabled && hasError && !loading && (
              <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />
            )}
            {!disabled && loading && (
              <i className={classNames('fa-solid fa-sync fa-spin', classNameTheme.iconLoading)} />
            )}
          </div>
        )}
      </div>
      {hasError && error && <ErrorMessage message={error} intent={intent} size={size} />}
    </div>
  );
};

export default TextArea;
