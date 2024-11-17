// Packages
import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { ChangeEvent, Ref } from 'react';

export type InputProps = {
  ref?: Ref<HTMLInputElement>;
  icon?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  prefix?: string;
  units?: { value: string; label: string }[];
  type?: 'text';
  value?: string;
  onChange?: (value: string) => void;
} & useThemeSharedProps<typeof InputStyles, typeof variantKeys>;

const Input = ({
  ref,
  className = '',
  icon = '',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  hasError = false,
  prefix = '',
  units = [],
  type = 'text',
  size = 'base',
  intent = 'default',
  value = '',
  onChange = noop,
  ...inputProps
}: InputProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys, false>('Input', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'icon', 'iconError', 'units'],
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  const [val, unit] = useMemo(() => {
    if (units.length === 0) {
      return [value, ''];
    }

    return [];
  }, [value, units]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(`${e.target.value}${unit}`);
    },
    [unit, onChange]
  );

  const handleChangeUnit = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange(`${val}${e.target.value}`);
    },
    [val, onChange]
  );

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.inputContainer}>
        <i className={classNames(icon, classNameTheme.icon)} />
        {prefix && <div>{prefix}</div>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={classNameTheme.input}
          disabled={disabled}
          value={val}
          onChange={handleChange}
          {...(inputProps as React.JSX.IntrinsicElements['input'])}
        />
        {hasError && <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />}
        {units.length > 0 && (
          <select className={classNameTheme.units} value={unit} onChange={handleChangeUnit}>
            {units.map((unit, i) => (
              <option key={i} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Input;
