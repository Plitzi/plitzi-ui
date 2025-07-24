import omit from 'lodash/omit';
import { useCallback } from 'react';

import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import type TextAreaStyles from './TextArea.styles';
import type { variantKeys } from './TextArea.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, RefObject, TextareaHTMLAttributes } from 'react';

export type TextAreaProps = {
  ref?: RefObject<HTMLTextAreaElement>;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  value?: string;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onChange?: (value: string) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange' | 'size'> &
  Omit<useThemeSharedProps<typeof TextAreaStyles, typeof variantKeys>, 'error'>;

const TextArea = ({
  ref,
  className = '',
  id,
  children,
  label = 'Text Area',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  clearable = false,
  size = 'md',
  intent,
  value = '',
  error = '',
  onChange,
  ...textareaProps
}: TextAreaProps) => {
  const classNameTheme = useTheme<typeof TextAreaStyles, typeof variantKeys>('TextArea', {
    className: className && typeof className === 'object' ? className.input : '',
    componentKey: ['input', 'inputContainer', 'iconFloatingContainer'],
    variants: { intent, size, disabled, error: !!error }
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
      className={omit(classNameTheme, 'input')}
      id={id}
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
        id={id}
        placeholder={placeholder}
        className={classNameTheme.input}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        {...(textareaProps as React.JSX.IntrinsicElements['textarea'])}
      />
    </InputContainer>
  );
};

export default TextArea;
