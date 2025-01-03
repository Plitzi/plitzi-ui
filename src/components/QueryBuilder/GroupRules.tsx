// Packages
import classNames from 'classnames';
import { useCallback, use, ChangeEvent } from 'react';

// Alias
import Button from '@components/Button';
import Switch from '@components/Switch';
import useTheme from '@hooks/useTheme';

// Relatives
import Select from '../Select';
import QueryBuilderContext from './QueryBuilderContext';
import Rule from './Rule';

// Types
import type { Rule as TRule, RuleGroup, Combinator } from './QueryBuilder';
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type GroupRulesProps = {
  className?: string;
  id?: string;
  rules?: (TRule | RuleGroup)[];
  combinator?: 'and' | 'or';
  enabled?: boolean;
  showBranches?: boolean;
  mainGroup?: boolean;
  ruleDirection?: 'horizontal' | 'vertical';
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const GroupRules = ({
  className = '',
  id: groupId = '',
  rules,
  combinator = 'and',
  enabled = true,
  showBranches = false,
  mainGroup = false,
  ruleDirection = 'horizontal',
  size
}: GroupRulesProps) => {
  const classNameTheme = useTheme<typeof QueryBuilderStyles, typeof variantKeys, false>('QueryBuilder', {
    className,
    componentKey: ['button', 'ruleGroup'],
    variant: { size, showBranches, mainGroup }
  });
  const {
    addRule,
    addGroup,
    updateCombinator,
    updateEnabled,
    remove,
    allowDisableRules,
    allowSubGroups,
    combinators,
    error
  } = use(QueryBuilderContext);

  const handleClickAddRule = useCallback(() => addRule(groupId), [addRule, groupId]);

  const handleClickAddGroup = useCallback(() => addGroup(groupId), [addGroup, groupId]);

  const handleChangeCombinator = useCallback(
    (value: string) => updateCombinator(groupId, value as Combinator),
    [groupId, updateCombinator]
  );

  const handleChangeEnabled = useCallback(
    (e: ChangeEvent) => updateEnabled(groupId, (e.target as HTMLInputElement).checked),
    [groupId, updateEnabled]
  );

  const handleRemove = useCallback(() => remove(groupId), [remove, groupId]);

  return (
    <div className={classNameTheme.ruleGroup}>
      <div className="flex gap-2">
        <Select
          value={combinator}
          size={size}
          onChange={handleChangeCombinator}
          disabled={!rules || rules.length < 2 || combinators.length < 2}
          error={error ? 'Invalid Combinator' : undefined}
        >
          {combinators.map(combinator => (
            <option key={combinator.value} value={combinator.value}>
              {combinator.label}
            </option>
          ))}
        </Select>
        <Button size={size} className={classNameTheme.button} title="+ Rule" onClick={handleClickAddRule}>
          + Rule
        </Button>
        <Button
          size={size}
          className={classNameTheme.button}
          title="+ Group"
          onClick={handleClickAddGroup}
          disabled={!allowSubGroups}
        >
          + Group
        </Button>
        {!mainGroup && (
          <Button size={size} className={classNameTheme.button} intent="danger" onClick={handleRemove}>
            X
          </Button>
        )}
        {allowDisableRules && (
          <div className="flex items-center" title="Enable Group">
            <Switch size={size} checked={enabled} onChange={handleChangeEnabled} />
          </div>
        )}
      </div>
      {rules &&
        rules.map((rule, i) => {
          const { id, enabled } = rule;
          if ('rules' in rule) {
            const { id, rules, combinator, enabled } = rule;

            return (
              <GroupRules
                key={i}
                id={id}
                rules={rules}
                combinator={combinator}
                enabled={enabled}
                showBranches={showBranches}
                ruleDirection={ruleDirection}
                size={size}
              />
            );
          }

          const { field, operator, value, isBinding } = rule;

          return (
            <Rule
              key={i}
              className={classNames('ml-4 not-first:mt-3 relative', {
                // before
                'before:absolute before:border-l before:border-b before:border-gray-400 before:last:rounded-bl before:translate-x-[-50%] before:translate-y-[-0%]':
                  showBranches,
                'before:left-[-4px] before:w-2': showBranches,
                'before:top-[-13px] before:h-[calc(50%_+_13px)]': showBranches,
                // after
                'after:absolute after:border-l after:border-gray-400 after:translate-x-[-50%] after:translate-y-[calc(50%_+_3px)]':
                  showBranches,
                'after:left-[-4px] after:w-2 last:after:border-none': showBranches,
                'after:top-[0px] after:h-[calc(50%_+_6px)]': showBranches && ruleDirection === 'horizontal',
                'after:top-[0px] after:h-[calc(50%_+_26px)]': showBranches && ruleDirection === 'vertical'
              })}
              id={id}
              field={field}
              operator={operator}
              value={value}
              ruleDirection={ruleDirection}
              isBinding={isBinding}
              enabled={enabled}
              size={size}
            />
          );
        })}
    </div>
  );
};

export default GroupRules;
