import classNames from 'classnames';
import get from 'lodash/get';
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

import Icon from '@components/Icon';
import MenuList from '@components/MenuList';
import useTheme from '@hooks/useTheme';

import { generateAllowedWordsRegex, generateMetricRegex } from './utils';

import type MetricInputStyles from './MetricInput.styles';
import type { variantKeys } from './MetricInput.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactElement, ReactNode, RefObject } from 'react';

export type MetricInputProps = {
  ref?: RefObject<HTMLInputElement>;
  children?: ReactNode;
  placeholder?: string;
  loading?: boolean;
  error?: boolean;
  prefix?: string;
  units?: { value: string; label: string }[];
  type?: 'text';
  value?: string;
  allowedWords?: string[];
  onChange?: (value: string) => void;
} & useThemeSharedProps<typeof MetricInputStyles, typeof variantKeys>;

const MetricInput = ({
  ref,
  children,
  className = '',
  placeholder = 'Placeholder',
  loading = false,
  disabled = false,
  error = false,
  prefix = '',
  units: unitsProp = [],
  type = 'text',
  size,
  intent = 'default',
  value: valueProp = '',
  allowedWords,
  onChange,
  ...inputProps
}: MetricInputProps) => {
  const classNameTheme = useTheme<typeof MetricInputStyles, typeof variantKeys>('MetricInput', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'units', 'divider'],
    variant: { intent: error ? 'error' : intent, size, disabled }
  });

  const units = useMemo(() => {
    if (!unitsProp.find(unit => unit.value === '' || unit.label === '-')) {
      return [...unitsProp, { label: '-', value: '' }];
    }

    return unitsProp;
  }, [unitsProp]);
  const allowedWordRegex = useMemo<RegExp | undefined>(() => generateAllowedWordsRegex(allowedWords), [allowedWords]);
  const unitsRegex = useMemo(() => generateMetricRegex(unitsProp, allowedWordRegex), [allowedWordRegex, unitsProp]);

  const [value, unit, hasAllowedWord] = useMemo(() => {
    const match = unitsRegex.exec(valueProp);
    const hasAllowedWord = !!allowedWordRegex?.exec(valueProp);
    const unit = get(match, 'groups.unit', get(units, '0.value', ''));
    const amount = get(match, 'groups.amount', '');
    if (amount === '') {
      return ['', hasAllowedWord ? '' : unit];
    }

    return [amount, hasAllowedWord ? '' : unit, hasAllowedWord];
  }, [valueProp, units, unitsRegex, allowedWordRegex]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const hasAllowedWord = !!allowedWordRegex?.exec(e.target.value);
      let newValue = e.target.value;
      if (e.target.value && unit && !hasAllowedWord) {
        newValue = `${e.target.value}${unit}`;
      }

      if (newValue && !unitsRegex.exec(newValue)) {
        return;
      }

      onChange?.(newValue);
    },
    [allowedWordRegex, unit, unitsRegex, onChange]
  );

  const handleChangeUnit = useCallback(
    (unit?: string) => onChange?.(value && !hasAllowedWord ? `${value}${unit}` : ''),
    [hasAllowedWord, onChange, value]
  );

  const { iconChildren } = useMemo(() => {
    const components = {
      iconChildren: undefined as ReactNode
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          className: classNames(classNameTheme.icon, (child.props as IconProps).className),
          size,
          intent: 'custom'
        });
      }
    });

    return components;
  }, [children, classNameTheme.icon, size]);

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.inputContainer}>
        {iconChildren && (
          <>
            {iconChildren}
            <div className={classNameTheme.divider} />
          </>
        )}
        {prefix && <div>{prefix}</div>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={classNameTheme.input}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          {...(inputProps as React.JSX.IntrinsicElements['input'])}
        />
        {(error || loading) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {error && <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />}
            {loading && <i className={classNames('fa-solid fa-sync fa-spin', classNameTheme.iconLoading)} />}
          </div>
        )}
        <div className={classNameTheme.divider} />
        <MenuList onSelect={handleChangeUnit} disabled={disabled}>
          <MenuList.Trigger className={classNameTheme.units}>{unit ? unit : '-'}</MenuList.Trigger>
          <MenuList.Menu>
            {units.map((unit, i) => (
              <MenuList.Item key={i} value={unit.value}>
                {unit.label}
              </MenuList.Item>
            ))}
          </MenuList.Menu>
        </MenuList>
      </div>
    </div>
  );
};

MetricInput.Icon = Icon;

export default MetricInput;
