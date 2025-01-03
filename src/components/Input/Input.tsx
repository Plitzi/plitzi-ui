// Packages
import { useCallback } from 'react';

// Alias
import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

// Relatives
import InputContainer from './InputContainer';

// Types
import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref, JSX } from 'react';

export type InputProps = {
  ref?: Ref<HTMLInputElement>;
  children?: ReactNode;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  label?: string;
  prefix?: string;
  type?: 'text';
  value?: string;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof InputStyles, typeof variantKeys>;

const Input = ({
  ref,
  children,
  className = '',
  label = '',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  clearable = false,
  prefix = '',
  type = 'text',
  size,
  intent = 'primary',
  value = '',
  error = false,
  onChange,
  ...inputProps
}: InputProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys>('Input', {
    className: className && typeof className === 'object' ? className.input : '',
    componentKey: 'input',
    variant: {
      intent,
      size,
      disabled: disabled || loading,
      error: !!error
    }
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value), [onChange]);

  const handleClickClear = useCallback(() => onChange?.(''), [onChange]);

  return (
    <InputContainer
      className={className}
      label={label}
      loading={loading}
      clearable={clearable}
      value={value}
      prefix={prefix}
      disabled={disabled}
      error={error}
      intent={intent}
      size={size}
      onClear={handleClickClear}
    >
      {children}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={classNameTheme}
        disabled={disabled || loading}
        value={value}
        onChange={handleChange}
        {...(inputProps as JSX.IntrinsicElements['input'])}
      />
    </InputContainer>
  );
};

Input.Icon = Icon;

export default Input;
