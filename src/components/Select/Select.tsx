// Packages
import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

// Alias
import ErrorMessage from '@components/ErrorMessage';
import Icon from '@components/Icon';
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

// Relatives
import SelectOption, { SelectOptionProps } from './SelectOption';

// Types
import type SelectStyles from './Select.styles';
import type { variantKeys } from './Select.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactNode, Ref, SelectHTMLAttributes, JSX, ReactElement, HTMLAttributes } from 'react';

export type SelectProps = {
  ref?: Ref<HTMLSelectElement>;
  children?: ReactNode;
  label?: string;
  placeholder?: string;
  value?: string | number;
  loading?: boolean;
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
  onChange,
  ...inputProps
}: SelectProps) => {
  const classNameTheme = useTheme<typeof SelectStyles, typeof variantKeys, false>('Select', {
    className,
    componentKey: ['root', 'select', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError'],
    variant: { intent: disabled || loading ? 'disabled' : error ? 'error' : intent, size }
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value), [onChange]);

  const { iconChildren, optionsChildren } = useMemo(() => {
    const components: { iconChildren: ReactNode; optionsChildren: ReactNode[] } = {
      iconChildren: undefined,
      optionsChildren: []
    };
    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          className: classNames(classNameTheme.icon, childProps.className),
          size,
          ...childProps,
          intent: childProps.intent ?? 'custom'
        });
      } else if (child.type === SelectOption || child.type === 'option') {
        components.optionsChildren.push(
          cloneElement<typeof child.props>(child, {
            ...(child.props as SelectOptionProps | HTMLAttributes<HTMLOptionElement>),
            key: i
          })
        );
      }
    });

    return components;
  }, [children, classNameTheme.icon, size]);

  return (
    <div className={classNameTheme.root}>
      {label && (
        <Label error={!!error} disabled={disabled} intent={intent} size={size}>
          {label}
        </Label>
      )}
      <div className={classNameTheme.inputContainer}>
        {iconChildren}
        <select
          ref={ref}
          className={classNameTheme.select}
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
        {(error || loading) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {!disabled && error && !loading && (
              <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />
            )}
            {!disabled && loading && (
              <i className={classNames('fa-solid fa-sync fa-spin', classNameTheme.iconLoading)} />
            )}
          </div>
        )}
      </div>
      {error && <ErrorMessage message={error} intent={intent} size={size} />}
    </div>
  );
};

Select.Icon = Icon;
Select.Option = SelectOption;

export default Select;
