// Packages
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

// Alias
import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

// Relatives
import SelectOption, { SelectOptionProps } from './SelectOption';

// Types
import type SelectStyles from './Select.styles';
import type { variantKeys } from './Select.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
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
  error?: ErrorMessageProps['message'];
  onChange?: (value: string) => void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof SelectStyles, typeof variantKeys>;

const Select = ({
  ref,
  children,
  label = 'Input',
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
    variant: { intent: disabled || loading ? 'disabled' : error ? 'error' : intent, size }
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
