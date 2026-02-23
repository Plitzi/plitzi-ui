import clsx from 'clsx';
import { useMemo, memo } from 'react';

import { omit } from '@/helpers/lodash';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import type SwitchyStyles from './Switch.styles';
import type { variantKeys } from './Switch.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { InputContainerProps } from '@components/Input/InputContainer';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject } from 'react';

export type SwitchProps = {
  ref?: RefObject<HTMLInputElement>;
  children?: ReactNode;
  label?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'> &
  Omit<useThemeSharedProps<typeof SwitchyStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const Switch = ({
  ref,
  children,
  id,
  className = '',
  value,
  label = '',
  disabled = false,
  loading = false,
  intent,
  size,
  error,
  onChange,
  ...inputProps
}: SwitchProps) => {
  const classNameTheme = useTheme<typeof SwitchyStyles & typeof InputStyles, typeof variantKeys>('Switch', {
    className,
    componentKey: [
      'switch',
      'slider',
      'root',
      'inputContainer',
      'iconFloatingContainer',
      'icon',
      'iconError',
      'iconClear',
      'input'
    ],
    variants: { intent, size, disabled, error: !!error }
  });
  const inputClassNameTheme = useMemo(() => omit(classNameTheme, ['switch', 'slide']), [classNameTheme]);

  return (
    <InputContainer
      className={inputClassNameTheme}
      id={id}
      label={label}
      error={error}
      disabled={disabled}
      intent={intent as InputContainerProps['intent']}
      size={size as InputContainerProps['size']}
      loading={loading}
      inline
      value={value}
    >
      {children}
      <div className={clsx('switch', classNameTheme.switch)}>
        <input
          {...inputProps}
          id={id}
          type="checkbox"
          ref={ref}
          value={value}
          readOnly={!onChange || inputProps.readOnly}
          onChange={onChange}
          className={classNameTheme.input}
          disabled={disabled}
        />
        <span className={clsx('slider', classNameTheme.slider)} />
      </div>
    </InputContainer>
  );
};

export default memo(Switch);
