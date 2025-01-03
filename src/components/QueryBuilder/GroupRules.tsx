// Packages
import { useCallback, use } from 'react';

// Alias
import Button from '@components/Button';
import Flex from '@components/Flex';
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
import type { ChangeEvent } from 'react';

export type GroupRulesProps = {
  className?: string;
  id?: string;
  rules?: (TRule | RuleGroup)[];
  combinator?: 'and' | 'or';
  enabled?: boolean;
  showBranches?: boolean;
  mainGroup?: boolean;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const GroupRules = ({
  className = '',
  id: groupId = '',
  rules,
  combinator = 'and',
  enabled = true,
  showBranches = false,
  mainGroup = false,
  direction,
  size
}: GroupRulesProps) => {
  const classNameTheme = useTheme<typeof QueryBuilderStyles, typeof variantKeys, false>('QueryBuilder', {
    className,
    componentKey: ['button', 'ruleGroup', 'ruleGroupHeader'],
    variant: { size, showBranches, mainGroup, direction }
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
      <Flex gap={2} className={classNameTheme.ruleGroupHeader}>
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
      </Flex>
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
                direction={direction}
                size={size}
              />
            );
          }

          const { field, operator, value, isBinding } = rule;

          return (
            <Rule
              key={i}
              id={id}
              field={field}
              operator={operator}
              value={value}
              isBinding={isBinding}
              enabled={enabled}
              size={size}
              showBranches={showBranches}
              mainGroup={mainGroup}
              direction={direction}
            />
          );
        })}
    </div>
  );
};

export default GroupRules;
