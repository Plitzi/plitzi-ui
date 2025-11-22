import get from 'lodash-es/get.js';
import { useCallback, use, useMemo } from 'react';

import Button from '@components/Button';
import Flex from '@components/Flex';
import Select2 from '@components/Select2';
import Switch from '@components/Switch';
import useTheme from '@hooks/useTheme';

import { defaultOperators } from './helpers/QueryBuilderContants';
import QueryBuilderContext from './QueryBuilderContext';
import RuleOperator from './RuleOperator';
import RuleValue from './RuleValue';

import type { Operator, RuleValue as TRuleValue } from './QueryBuilder';
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { Option, OptionGroup } from '@components/Select2';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent } from 'react';

export type RuleProps = {
  id?: string;
  field?: string;
  operator?: string;
  value?: TRuleValue;
  isBinding?: boolean;
  enabled?: boolean;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const Rule = ({
  className = '',
  id = '',
  field = '',
  operator = '',
  value = '',
  isBinding = false,
  enabled = true,
  size,
  showBranches,
  direction,
  intent
}: RuleProps) => {
  const { fields, update, updateRuleOperator, updateRuleValue, updateEnabled, remove, allowDisableRules, error } =
    use(QueryBuilderContext);
  const classNameTheme = useTheme<typeof QueryBuilderStyles, typeof variantKeys>('QueryBuilder', {
    className,
    componentKey: ['rule', 'ruleField', 'ruleOperator'],
    variants: { size, showBranches, direction, error, intent }
  });
  const fieldsOptions = useMemo(() => {
    const fieldsAux = Object.values(fields).reduce<Array<Option | OptionGroup>>((acum, field) => {
      const { name, label, operators, defaultValue, group: groupName = 'Others' } = field;
      if (groupName) {
        const group = acum.filter(option => 'options' in option).find(option => option.label === groupName);
        if (!group) {
          return [...acum, { label: groupName, options: [{ label, value: name, operators, defaultValue }] }];
        }

        (group as OptionGroup).options.push({ label, value: name, operators, defaultValue });

        return acum;
      }

      return [...acum, { label, value: name, operators, defaultValue }];
    }, []);

    if (fieldsAux.length === 1) {
      return get(fieldsAux, '0.options', []) as Option[];
    }

    return fieldsAux;
  }, [fields]);

  const handleChangeField = useCallback(
    (option?: Exclude<Option, OptionGroup>) => {
      if (!option) {
        update(id, { field: '', operator: '=', value: '' });

        return;
      }

      const { value, defaultValue, operators } = option;
      const operator = get(operators, '0.name', get(defaultOperators, '0.name', '='));
      update(id, { field: value, operator, value: defaultValue ?? '' });
    },
    [update, id]
  );

  const handleClickBind = useCallback(() => update(id, { isBinding: !isBinding, value: '' }), [id, update, isBinding]);

  const handleChangeOperator = useCallback(
    (value: string) => updateRuleOperator(id, value as Operator),
    [id, updateRuleOperator]
  );

  const handleChange = useCallback((value: TRuleValue) => updateRuleValue(id, value), [updateRuleValue, id]);

  const handleChangeBind = useCallback(
    (option?: Exclude<Option, OptionGroup>) => updateRuleValue(id, (option?.value ?? '') as TRuleValue),
    [updateRuleValue, id]
  );

  const handleChangeEnabled = useCallback(
    (e: ChangeEvent) => updateEnabled(id, (e.target as HTMLInputElement).checked),
    [updateEnabled, id]
  );

  const handleRemove = useCallback(() => remove(id), [remove, id]);

  const fieldDefinition = useMemo(
    () =>
      get(fields, field, {
        label: '',
        operators: [],
        inputType: undefined,
        options: [],
        placeholder: '',
        validator: undefined
      }),
    [fields, field]
  );

  const { label, operators, inputType, options = [], placeholder = '', validator } = fieldDefinition;

  return (
    <Flex gap={2} className={classNameTheme.rule}>
      <Flex grow basis={0} gap={2} className={classNameTheme.ruleField}>
        <Select2
          placeholder="Select a field"
          options={fieldsOptions}
          value={field}
          size={size}
          onChange={handleChangeField}
          allowCreateOptions
          error={error}
        />
        {direction === 'vertical' && (
          <>
            <Button size={size} intent="danger" className="rounded-sm" onClick={handleRemove}>
              X
            </Button>
            {allowDisableRules && (
              <div className="flex items-center" title="Enable Group">
                <Switch size={size} checked={enabled} onChange={handleChangeEnabled} />
              </div>
            )}
          </>
        )}
      </Flex>
      <RuleOperator value={operator} operators={operators} error={error} size={size} onChange={handleChangeOperator} />
      {!['empty', 'notEmpty'].includes(operator) && (
        <Flex grow basis={0} gap={2} className="min-w-0">
          {!['between', 'notBetween'].includes(operator) && !isBinding && (
            <RuleValue
              className="w-full"
              placeholder={placeholder ? placeholder : `Enter ${label ? label : 'a value'}`}
              type={inputType}
              options={options}
              value={value}
              error={error}
              size={size}
              disabled={!field}
              validator={validator}
              onChange={handleChange}
            />
          )}
          {['between', 'notBetween'].includes(operator) && !isBinding && (
            <>
              <RuleValue
                className="w-full"
                placeholder={placeholder ? placeholder : `Enter ${label ? label : 'a value'}`}
                type={inputType}
                valuePosition={0}
                options={options}
                value={value}
                error={error}
                size={size}
                disabled={!field}
                validator={validator}
                onChange={handleChange}
              />
              <RuleValue
                className="w-full"
                placeholder={placeholder ? placeholder : `Enter ${label ? label : 'a value'}`}
                type={inputType}
                valuePosition={1}
                options={options}
                value={value}
                error={error}
                size={size}
                disabled={!field}
                validator={validator}
                onChange={handleChange}
              />
            </>
          )}
          {isBinding && field && (
            <Select2
              placeholder="Select a field"
              options={fieldsOptions}
              value={value as string}
              size={size}
              onChange={handleChangeBind}
            />
          )}
          {direction === 'vertical' && (
            <Button size={size} intent="primary" onClick={handleClickBind}>
              {!isBinding && <Button.Icon icon="fa-solid fa-plug" />}
              {isBinding && <Button.Icon icon="fa-solid fa-plug-circle-xmark" />}
            </Button>
          )}
        </Flex>
      )}
      {direction === 'horizontal' && (
        <>
          <Button size={size} className="aspect-square" intent="primary" onClick={handleClickBind}>
            {!isBinding && <Button.Icon icon="fa-solid fa-plug" />}
            {isBinding && <Button.Icon icon="fa-solid fa-plug-circle-xmark" />}
          </Button>
          <Button size={size} intent="danger" className="aspect-square" onClick={handleRemove}>
            X
          </Button>
          {allowDisableRules && (
            <div className="flex items-center" title="Enable Group">
              <Switch size={size} checked={enabled} onChange={handleChangeEnabled} />
            </div>
          )}
        </>
      )}
    </Flex>
  );
};

export default Rule;
