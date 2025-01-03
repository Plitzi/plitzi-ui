// Packages
import classNames from 'classnames';
import get from 'lodash/get';
import { useCallback, useMemo, useState } from 'react';

// Alias
import Checkbox from '@components/Checkbox';
import Input from '@components/Input';
import Select from '@components/Select';
// import useTheme from '@hooks/useTheme';

// Types
import type { Field, RuleValue } from './QueryBuilder';
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
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
  error?: boolean;
  onChange?: (value: RuleValue) => void;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const RuleValue = ({
  className = '',
  valuePosition,
  value = '',
  values = valuesDefault,
  placeholder = 'Enter a value',
  type = 'text',
  error = false,
  size,
  validator,
  onChange
}: RuleValueProps) => {
  // const classNameTheme = useTheme<typeof QueryBuilderStyles, typeof variantKeys, false>('QueryBuilder', {
  //   className,
  //   componentKey: ['button', 'ruleGroup'],
  //   variant: { size, showBranches, mainGroup }
  // });
  const [errorInternal, setErrorInternal] = useState<string | boolean | undefined>(error);

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
    (val: string) => {
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
      setErrorInternal(error === true ? false : error);
    },
    [validator, onChange, valuePosition, value]
  );

  switch (type) {
    case 'checkbox':
      return (
        <div className={classNames('flex items-center', className)}>
          <Checkbox size={size} checked={finalValue} onChange={handleChangeCheckbox} />
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
          className={classNames('rounded', className, { '!border-red-300': error })}
          value={finalValue}
          size={size}
          onChange={handleChange}
        >
          {values.map((option, i) => (
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
          className={classNames(className)}
          value={finalValue}
          error={error}
          size={size}
          onChange={handleChange}
        />
      );
  }
};

export default RuleValue;
