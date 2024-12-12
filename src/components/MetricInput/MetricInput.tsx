// Packages
import classNames from 'classnames';
import get from 'lodash/get';
import { useCallback, useMemo } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type MetricInputStyles from './MetricInput.styles';
import type { variantKeys } from './MetricInput.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, Ref } from 'react';

export type MetricInputProps = {
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
} & useThemeSharedProps<typeof MetricInputStyles, typeof variantKeys>;

const MetricInput = ({
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
  size,
  intent = 'default',
  value = '',
  onChange,
  ...inputProps
}: MetricInputProps) => {
  const classNameTheme = useTheme<typeof MetricInputStyles, typeof variantKeys, false>('MetricInput', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'units'],
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  const unitsFinal = useMemo(() => {
    if (!units.find(unit => unit.value === '')) {
      return [...units, { label: '-', value: '' }];
    }

    return units;
  }, [units]);

  const unitsRegex = useMemo(() => {
    const amountRegex = '(?<amount>[0-9]+(\\.|\\.[0-9]+|))';
    const unitRegex = `(?<unit>${unitsFinal.map(unit => unit.value).join('|')})`;

    return new RegExp(`^${amountRegex}${unitRegex}$`, 'im');
  }, [unitsFinal]);

  const [val, unit] = useMemo(() => {
    const match = unitsRegex.exec(value);
    const unit = get(match, 'groups.unit', get(unitsFinal, '0.value', ''));
    const amount = get(match, 'groups.amount', '');
    if (amount === '') {
      return ['', unit];
    }

    return [amount, unit];
  }, [value, unitsFinal, unitsRegex]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = '';
      if (e.target.value && unit) {
        newValue = `${e.target.value}${unit}`;
      } else {
        newValue = e.target.value;
      }

      if (newValue && !unitsRegex.exec(newValue)) {
        return;
      }

      onChange?.(newValue);
    },
    [unit, unitsRegex, onChange]
  );

  const handleChangeUnit = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (val) {
        onChange?.(`${val}${e.target.value}`);
      } else {
        onChange?.('');
      }
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
        {(hasError || loading) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {hasError && <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />}
            {loading && <i className={classNames('fa-solid fa-sync fa-spin', classNameTheme.iconLoading)} />}
          </div>
        )}
        {unitsFinal.length > 0 && (
          <select className={classNameTheme.units} value={unit} onChange={handleChangeUnit}>
            {unitsFinal.map((unit, i) => (
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

export default MetricInput;
