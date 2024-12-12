// Packages
import classNames from 'classnames';
import { useCallback } from 'react';

// Alias
import ErrorMessage from '@components/ErrorMessage';
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

// Types
import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { LabelProps } from '@components/Label';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react';

export type InputProps = {
  ref?: Ref<HTMLInputElement>;
  icon?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  prefix?: string;
  type?: 'text';
  value?: string;
  error?: ErrorMessageProps['message'];
  onChange?: (value: string) => void;
} & Pick<LabelProps, 'label'> &
  Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof InputStyles, typeof variantKeys>;

const Input = ({
  ref,
  className = '',
  icon = '',
  label = 'Input',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  hasError = false,
  prefix = '',
  type = 'text',
  size,
  intent = 'default',
  value = '',
  error = '',
  onChange,
  ...inputProps
}: InputProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys, false>('Input', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError'],
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={classNameTheme.root}>
      <Label label={label} hasError={hasError} disabled={disabled} intent={intent} size={size} />
      <div className={classNameTheme.inputContainer}>
        <i className={classNames(icon, classNameTheme.icon)} />
        {prefix && <div>{prefix}</div>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={classNameTheme.input}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          {...(inputProps as React.JSX.IntrinsicElements['input'])}
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

export default Input;
