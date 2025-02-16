import moment from 'moment';

import type { Rule, RuleGroup } from '../QueryBuilder';

export const isDate = (value: unknown): value is Date =>
  typeof value === 'string' && moment(value, 'YYYY-MM-DD', true).isValid();

export const isNumeric = (value: unknown): value is number | string =>
  typeof value === 'number' || (typeof value === 'string' && !value.includes(',') && !Number.isNaN(parseFloat(value)));

export const isRuleGroup = (rule: Rule | RuleGroup): rule is RuleGroup => 'rules' in rule;

export type QueryMapNode = { id: string; parentId: string; path: string };

export const getQueryMap = (
  query?: RuleGroup,
  parentId?: string,
  path = ''
): { [key: string]: QueryMapNode | undefined } => {
  let map = {};
  if (!query || !query.id || !Array.isArray(query.rules)) {
    return map;
  }

  const { id, rules } = query;
  Object.values(rules).forEach((rule: Rule | RuleGroup, i) => {
    if ('rules' in rule) {
      map = { ...map, ...getQueryMap(rule, id, path ? `${path}.rules.${i}` : `rules.${i}`) };
    } else if (rule.id) {
      const { id: ruleId } = rule;
      map = {
        ...map,
        [ruleId]: { id: ruleId, parentId: id, type: 'rule', path: path ? `${path}.rules.${i}` : `rules.${i}` }
      };
    }
  });

  return { ...map, [id]: { id, parentId, type: 'group', path } };
};
