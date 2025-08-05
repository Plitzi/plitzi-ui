import omit from 'lodash/omit';
import { useMemo } from 'react';

import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import type CheckboxStyles from './Checkbox.styles';
import type { variantKeys } from './Checkbox.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { InputContainerProps } from '@components/Input/InputContainer';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { RefObject, InputHTMLAttributes } from 'react';

export type CheckboxProps = {
  ref?: RefObject<HTMLInputElement>;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Omit<useThemeSharedProps<typeof CheckboxStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const Checkbox = ({
  ref,
  children,
  id,
  loading = false,
  disabled = false,
  className = '',
  label = '',
  error,
  size,
  value,
  intent,
  ...inputProps
}: CheckboxProps) => {
  const classNameTheme = useTheme<typeof CheckboxStyles & typeof InputStyles, typeof variantKeys>('Checkbox', {
    className,
    componentKey: ['root', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'iconClear', 'input'],
    variants: { intent, size, disabled, error: !!error }
  });
  const inputClassNameTheme = useMemo(() => omit(classNameTheme, ['input']), [classNameTheme]);

  return (
    <InputContainer
      className={inputClassNameTheme}
      id={id}
      label={label}
      error={error}
      disabled={disabled}
      intent={intent as InputContainerProps['intent']}
      size={size}
      loading={loading}
      inline
      value={value}
    >
      {children}
      <input type="checkbox" ref={ref} className={classNameTheme.input} {...inputProps} value={value} />
    </InputContainer>
  );
};

export default Checkbox;
