// Packages
import classNames from 'classnames';
import get from 'lodash/get';
import { useCallback, useMemo, useState } from 'react';

// Alias
import Checkbox from '@components/Checkbox';
import Input from '@components/Input';
import Select from '@components/Select';

// Types
import type { Field, RuleValue } from './QueryBuilder';
import type { MouseEvent } from 'react';

const valuesDefault = [] as { value: RuleValue; label: string }[];

export type RuleValueProps = {
  className?: string;
  valuePosition?: number;
  value?: RuleValue;
  values?: { value: RuleValue; label: string }[];
  placeholder?: string;
  type?: Field['inputType'];
  validator?: (value: string) => string | boolean;
  hasError?: boolean;
  onChange?: (value: RuleValue) => void;
};

const RuleValue = ({
  className = '',
  valuePosition,
  value = '',
  values = valuesDefault,
  placeholder = 'Enter a value',
  type = 'text',
  hasError = false,
  validator,
  onChange
}: RuleValueProps) => {
  const [error, setError] = useState(false);

  const handleChangeCheckbox = useCallback(
    (e: MouseEvent) => onChange?.((e.target as HTMLInputElement).checked),
    [onChange]
  );

  const finalValue = useMemo(() => {
    if (Number.isInteger(valuePosition)) {
      const valueParts = value.split(',');

      return get(valueParts, valuePosition, value);
    }

    return value;
  }, [value, valuePosition]);

  const handleChange = useCallback(
    (e: MouseEvent) => {
      const val = (e.target as HTMLInputElement).value;
      if (val.includes(',') && Number.isInteger(valuePosition)) {
        return;
      }

      if (Number.isInteger(valuePosition)) {
        const valueParts = value.split(',');
        valueParts[valuePosition] = e.target.value;
        onChange(valueParts.join(','));
      } else {
        onChange(val);
      }
      if (typeof validator !== 'function') {
        return;
      }

      const error = validator(val);
      setError(error === true ? '' : error);
    },
    [validator, onChange, valuePosition, value]
  );

  switch (type) {
    case 'checkbox':
      return (
        <div className={classNames('flex items-center', className)}>
          <Checkbox checked={finalValue} onChange={handleChangeCheckbox} />
        </div>
      );

    case 'radio':
      return undefined;

    case 'multiselect':
    case 'select':
      return (
        <Select
          placeholder={placeholder}
          size="sm"
          multiple={type === 'multiselect'}
          className={classNames('rounded', className, { '!border-red-300': error })}
          value={finalValue}
          onChange={handleChange}
        >
          {values &&
            values.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
      );

    case 'text':
    default:
      return (
        <Input
          placeholder={placeholder}
          error={error}
          size="sm"
          className={classNames(className)}
          value={finalValue}
          onChange={handleChange}
          hasError={hasError}
        />
      );
  }
};

export default RuleValue;
