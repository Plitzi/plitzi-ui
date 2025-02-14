// Packages
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

// Alias
import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

// Relatives
import SelectOption from './SelectOption';

// Types
import type SelectStyles from './Select.styles';
import type { variantKeys } from './Select.styles';
import type { SelectOptionProps } from './SelectOption';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactNode, Ref, SelectHTMLAttributes, JSX, HTMLAttributes } from 'react';

export type SelectProps = {
  ref?: Ref<HTMLSelectElement>;
  children?: ReactNode;
  label?: string;
  placeholder?: string;
  value?: string | number;
  loading?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onChange?: (value: string) => void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'onChange' | 'size'> &
  Omit<useThemeSharedProps<typeof SelectStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const Select = ({
  ref,
  children,
  label = '',
  placeholder = '',
  value = '',
  className = '',
  error = '',
  size,
  intent,
  loading = false,
  disabled = false,
  clearable = false,
  onChange,
  ...inputProps
}: SelectProps) => {
  const classNameTheme = useTheme<typeof SelectStyles, typeof variantKeys>('Select', {
    className: className && typeof className === 'object' ? className.input : '',
    componentKey: 'input',
    variant: { intent, size, error: !!error, disabled }
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value), [onChange]);

  const handleClickClear = useCallback(() => onChange?.(''), [onChange]);

  const { optionsChildren, othersChildren } = useMemo(() => {
    const components: { optionsChildren: ReactNode[]; othersChildren: ReactNode[] } = {
      optionsChildren: [],
      othersChildren: []
    };
    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === SelectOption || child.type === 'option') {
        components.optionsChildren.push(
          cloneElement<typeof child.props>(child, {
            ...(child.props as SelectOptionProps | HTMLAttributes<HTMLOptionElement>),
            key: i
          })
        );
      } else {
        components.othersChildren.push(child);
      }
    });

    return components;
  }, [children]);

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
      {othersChildren}
      <select
        ref={ref}
        className={classNameTheme}
        disabled={disabled || loading}
        value={value}
        onChange={handleChange}
        {...(inputProps as JSX.IntrinsicElements['select'])}
      >
        {placeholder && (
          <option key="select-placeholder" value="">
            {placeholder}
          </option>
        )}
        {optionsChildren}
      </select>
    </InputContainer>
  );
};

Select.Icon = Icon;
Select.Option = SelectOption;

export default Select;
