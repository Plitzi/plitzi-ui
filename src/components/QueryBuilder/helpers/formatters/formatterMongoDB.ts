// Packages
import get from 'lodash/get';

// Relatives
import { isDate, isNumeric } from '../QueryBuilderHelper';

// Types
import type { QueryBuilderParams, Rule, RuleGroup } from '../../QueryBuilder';

const formatBasic = (rule: Rule) => {
  const { field, operator, value } = rule;
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
  const { field, value } = rule;
  if (not) {
    return { [field]: { $not: { $regex: value, $options: 'i' } } };
  }

  return { [field]: { $regex: value, $options: 'i' } };
};

const formatBeginsWith = (rule: Rule, not = false) => {
  const { field, value } = rule;
  if (not) {
    return { [field]: { $not: { $regex: `^${value}`, $options: 'i' } } };
  }

  return { [field]: { $regex: `^${value}`, $options: 'i' } };
};

const formatEndsWith = (rule: Rule, not = false) => {
  const { field, value } = rule;
  if (not) {
    return { [field]: { $not: { $regex: `${value}$`, $options: 'i' } } };
  }

  return { [field]: { $regex: `${value}$`, $options: 'i' } };
};

const formatEmpty = (rule: Rule, not = false) => {
  const { field } = rule;
  if (not) {
    return { [field]: { $ne: '' } };
  }

  return { [field]: '' };
};

const formatIn = (rule: Rule, not = false) => {
  const { field, value } = rule;
  let valueArr: (string | number)[] = [];
  if (typeof value === 'string' && value.includes(',')) {
    valueArr = value.split(',').map(v => v.trim());
  } else if (typeof value === 'string' || typeof value === 'number') {
    valueArr = [value];
  }

  if (not) {
    return { [field]: { $nin: valueArr } };
  }

  return { [field]: { $in: valueArr } };
};

const formatBetween = (rule: Rule) => {
  const { field, value } = rule;
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

const formatterMongoDB = (query?: RuleGroup, granulated = false, params: QueryBuilderParams = {}): object => {
  if (!query) {
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
};

export default formatterMongoDB;
