import { isDate } from '@/helpers/formatDate';
import { get } from '@/helpers/lodash';

import { isNumeric } from '../QueryBuilderHelper';

import type { QueryBuilderParams, Rule, RuleGroup } from '../../QueryBuilder';

// SECURITY: validate field key against an identifier whitelist. Mongo treats keys starting
// with `$` as operators (e.g. `$where`, `$function`) which can lead to NoSQL injection if a
// rule with `field: "$where"` is constructed. Empty result rejects the rule.
const MONGO_FIELD_RE = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
const mongoField = (s: unknown): string => {
  const v = String(s ?? '');
  return MONGO_FIELD_RE.test(v) ? v : '';
};

// SECURITY: escape regex metacharacters so attacker-controlled `value` cannot craft
// catastrophic-backtracking patterns (ReDoS) or alter regex semantics. Plain text becomes
// literal text.
const regexEscape = (s: unknown): string => String(s ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// SECURITY: strip operator-prefixed object values that would be interpreted as Mongo
// operators ($ne, $gt, $where...) — coerces values to scalar primitives only.
const scalarValue = (v: unknown): string | number | boolean | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return v;
  // Reject objects/arrays/functions — caller's intent here is value comparison, not operator
  // injection. Coerce to string as a safe fallback.
  return String(v);
};

const formatBasic = (rule: Rule) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const { operator } = rule;
  const value = scalarValue(rule.value);
  switch (operator) {
    case '=':
      return { [field]: value };
    case '!=':
      return { [field]: { $ne: value } };
    case '<':
      if (typeof value === 'string' && isNumeric(value)) {
        return { [field]: { $lt: parseFloat(value) } };
      }

      return { [field]: { $lt: value } };
    case '>':
      if (typeof value === 'string' && isNumeric(value)) {
        return { [field]: { $gt: parseFloat(value) } };
      }

      return { [field]: { $gt: value } };
    case '<=':
      if (typeof value === 'string' && isNumeric(value)) {
        return { [field]: { $lte: parseFloat(value) } };
      }

      return { [field]: { $lte: value } };
    case '>=':
      if (typeof value === 'string' && isNumeric(value)) {
        return { [field]: { $gte: parseFloat(value) } };
      }

      return { [field]: { $gte: value } };
    default:
      return {};
  }
};

const formatContains = (rule: Rule, not = false) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const value = regexEscape(rule.value);
  if (not) {
    return { [field]: { $not: { $regex: value, $options: 'i' } } };
  }

  return { [field]: { $regex: value, $options: 'i' } };
};

const formatBeginsWith = (rule: Rule, not = false) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const value = regexEscape(rule.value);
  if (not) {
    return { [field]: { $not: { $regex: `^${value}`, $options: 'i' } } };
  }

  return { [field]: { $regex: `^${value}`, $options: 'i' } };
};

const formatEndsWith = (rule: Rule, not = false) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const value = regexEscape(rule.value);
  if (not) {
    return { [field]: { $not: { $regex: `${value}$`, $options: 'i' } } };
  }

  return { [field]: { $regex: `${value}$`, $options: 'i' } };
};

const formatEmpty = (rule: Rule, not = false) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  if (not) {
    return { [field]: { $ne: '' } };
  }

  return { [field]: '' };
};

const formatIn = (rule: Rule, not = false) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const { value } = rule;
  let valueArr: (string | number)[] = [];
  if (typeof value === 'string' && value.includes(',')) {
    valueArr = value.split(',').map(v => v.trim());
  } else if (typeof value === 'string' || typeof value === 'number') {
    valueArr = [value];
  }

  // Reject any non-scalar entries to prevent {$ne:null} / operator injection.
  valueArr = valueArr.filter(v => typeof v === 'string' || typeof v === 'number');

  if (not) {
    return { [field]: { $nin: valueArr } };
  }

  return { [field]: { $in: valueArr } };
};

const formatBetween = (rule: Rule) => {
  const field = mongoField(rule.field);
  if (!field) return {};
  const { value } = rule;
  let valueArr: string[] = [];
  if (typeof value === 'string' && value.includes(',')) {
    valueArr = value.split(',').map(v => v.trim());
  }

  if (valueArr.length < 2) {
    return { [field]: false };
  }

  if (isDate(valueArr[0]) && isDate(valueArr[1])) {
    return { [field]: { $gte: new Date(valueArr[0]), $lte: new Date(valueArr[1]) } };
  }

  return { [field]: { $gte: valueArr[0], $lte: valueArr[1] } };
};

const parseRule = (rule: Rule, params?: QueryBuilderParams) => {
  const { isBinding } = rule;
  if (isBinding) {
    return { ...rule, value: get(params, rule.value, rule.value) } as Rule;
  }

  return rule;
};

const formatField = (rule?: Rule, params?: QueryBuilderParams) => {
  if (!rule) {
    return {};
  }

  const { isBinding } = rule;
  if (isBinding) {
    rule = parseRule(rule, params);
  }

  const { operator } = rule;
  switch (operator) {
    case '=':
    case '!=':
    case '<':
    case '>':
    case '<=':
    case '>=':
      return formatBasic(rule);
    case 'contains':
      return formatContains(rule);
    case 'doesNotContain':
      return formatContains(rule, true);
    case 'beginsWith':
      return formatBeginsWith(rule);
    case 'doesNotBeginWith':
      return formatBeginsWith(rule, true);
    case 'endsWith':
      return formatEndsWith(rule);
    case 'doesNotEndWith':
      return formatEndsWith(rule, true);
    case 'empty':
      return formatEmpty(rule);
    case 'notEmpty':
      return formatEmpty(rule, true);
    case 'in':
      return formatIn(rule);
    case 'notIn':
      return formatIn(rule, true);
    case 'between':
      return formatBetween(rule);
    default:
      return {};
  }
};

function formatterMongoDB(query: RuleGroup, granulated: false, params?: QueryBuilderParams): string;
function formatterMongoDB(query: RuleGroup, granulated?: boolean, params?: QueryBuilderParams): object;
function formatterMongoDB(
  query: RuleGroup,
  granulated: boolean = false,
  params: QueryBuilderParams = {}
): string | object {
  if (!(query as RuleGroup | undefined)) {
    return {};
  }

  const { combinator, rules, enabled } = query;
  if (!Array.isArray(rules) || enabled === false) {
    return {};
  }

  const content = rules
    .filter(rule => rule.enabled !== false)
    .map(rule => {
      if ('rules' in rule) {
        return formatterMongoDB(rule, granulated, params);
      }

      return formatField(rule, params);
    });

  if (!granulated) {
    if (!content.length) {
      return {};
    }

    if (content.length === 1) {
      return content[0];
    }

    return { [`$${combinator}`]: content };
  }

  return content;
}

export default formatterMongoDB;
