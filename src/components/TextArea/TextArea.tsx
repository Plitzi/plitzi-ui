// Packages
import { useCallback } from 'react';

// Alias
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

// Types
import type TextAreaStyles from './TextArea.styles';
import type { variantKeys } from './TextArea.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react';

export type TextAreaProps = {
  ref?: Ref<HTMLTextAreaElement>;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  value?: string;
  error?: ErrorMessageProps['message'];
  onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof TextAreaStyles, typeof variantKeys>;

const TextArea = ({
  ref,
  className = '',
  children,
  label = 'Text Area',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  clearable = false,
  size = 'md',
  intent = 'default',
  value = '',
  error = '',
  onChange,
  ...textareaProps
}: TextAreaProps) => {
  const classNameTheme = useTheme<typeof TextAreaStyles, typeof variantKeys>('TextArea', {
    className: className && typeof className === 'object' ? className.input : '',
    componentKey: 'input',
    variant: { intent: disabled ? 'disabled' : error ? 'error' : intent, size }
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleClickClear = useCallback(() => onChange?.(''), [onChange]);

  return (
    <InputContainer
      className={className}
      label={label}
      error={error}
      disabled={disabled}
      intent={intent}
      size={size}
      loading={loading}
      clearable={clearable}
      value={value}
      onClear={handleClickClear}
    >
      {children}
      <textarea
        ref={ref}
        placeholder={placeholder}
        className={classNameTheme}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        {...(textareaProps as React.JSX.IntrinsicElements['textarea'])}
      />
    </InputContainer>
  );
};

export default TextArea;
