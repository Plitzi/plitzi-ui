import get from 'lodash-es/get.js';
import { useCallback, useMemo, useState } from 'react';

import Checkbox from '@components/Checkbox';
import Input from '@components/Input';
import Select from '@components/Select';
// import useTheme from '@hooks/useTheme';

import type { Field, RuleValue } from './QueryBuilder';
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent } from 'react';

const valuesDefault = [] as { value: RuleValue; label: string }[];

export type RuleValueProps = {
  className?: string;
  valuePosition?: number;
  value?: RuleValue;
  options?: { value: RuleValue; label: string }[];
  placeholder?: string;
  type?: Field['inputType'];
  validator?: (value: string) => string | boolean;
  error?: boolean;
  onChange?: (value: RuleValue) => void;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const RuleValue = ({
  className = '',
  valuePosition,
  value = '',
  options = valuesDefault,
  placeholder = 'Enter a value',
  type = 'text',
  error = false,
  size,
  disabled,
  validator,
  onChange
}: RuleValueProps) => {
  // const classNameTheme = useTheme<typeof QueryBuilderStyles, typeof variantKeys, false>('QueryBuilder', {
  //   className,
  //   componentKey: ['button', 'ruleGroup'],
  //   variants: { size, showBranches, mainGroup }
  // });
  const [errorInternal, setErrorInternal] = useState<string | boolean | undefined>(error);

  const handleChangeCheckbox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange?.((e.target as HTMLInputElement).checked),
    [onChange]
  );

  const finalValue = useMemo<string | boolean>(() => {
    if (Number.isInteger(valuePosition) && typeof value === 'string') {
      const valueParts: string[] = value.split(',');

      return get(valueParts, `${valuePosition}`, value);
    }

    return value as string;
  }, [value, valuePosition]);

  const handleChange = useCallback(
    (val: string) => {
      if (val.includes(',') && Number.isInteger(valuePosition)) {
        return;
      }

      if (valuePosition && Number.isInteger(valuePosition) && typeof value === 'string') {
        const valueParts: string[] = value.split(',');
        valueParts[valuePosition] = val;
        onChange?.(valueParts.join(','));
      } else {
        onChange?.(val);
      }
      if (typeof validator !== 'function') {
        return;
      }

      const error = validator(val);
      setErrorInternal(error === true ? false : error);
    },
    [validator, onChange, valuePosition, value]
  );

  switch (type) {
    case 'checkbox':
      return (
        <div className="flex items-center">
          <Checkbox
            className={className}
            size={size}
            checked={finalValue as boolean}
            disabled={disabled}
            onChange={handleChangeCheckbox}
          />
        </div>
      );

    case 'radio':
      return undefined;

    case 'multiselect':
    case 'select':
      return (
        <Select
          placeholder={placeholder}
          multiple={type === 'multiselect'}
          value={finalValue as string}
          size={size}
          disabled={disabled}
          error={errorInternal}
          onChange={handleChange}
        >
          {options.map((option, i) => (
            <option key={i} value={option.value as string}>
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
          className={className}
          value={finalValue as string}
          error={errorInternal}
          size={size}
          disabled={disabled}
          onChange={handleChange}
        />
      );
  }
};

export default RuleValue;
