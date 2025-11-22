import get from 'lodash-es/get.js';

import { isDate, isNumeric } from '../QueryBuilderHelper';

import type { QueryBuilderParams, Rule, RuleGroup } from '../../QueryBuilder';

export const formatBasic = (rule: Rule) => {
  const { field, value, operator } = rule;

  if (typeof value === 'boolean') {
    return `${field} ${operator} ${value ? 'TRUE' : 'FALSE'}`;
  }

  if (typeof value === 'string' && !isNumeric(value)) {
    return `${field} ${operator} '${value as string}'`;
  }

  if (typeof value === 'number' || isNumeric(value)) {
    return `${field} ${operator} ${value}`;
  }

  if (isDate(value)) {
    return `${field} ${operator} DATE '${value.toString()}'`;
  }

  return `${field} ${operator} '${JSON.stringify(value)}'`;
};

export const formatContains = (rule: Rule, not = false) => {
  const { field, value } = rule;

  return `${field}${not ? ' not' : ''} like '%${value as string}%'`;
};

export const formatBeginsWith = (rule: Rule, not = false) => {
  const { field, value } = rule;

  return `${field}${not ? ' not' : ''} like '${value as string}%'`;
};

export const formatEndsWith = (rule: Rule, not = false) => {
  const { field, value } = rule;

  return `${field}${not ? ' not' : ''} like '%${value as string}'`;
};

export const formatEmpty = (rule: Rule, not = false) => {
  const { field } = rule;

  return `${field} is${not ? ' not' : ''} NULL`;
};

export const formatIn = (rule: Rule, not = false) => {
  const { field, value } = rule;
  let valueArr: string[] = [];
  if (typeof value === 'string' && value.includes(',')) {
    valueArr = value.split(',');
  } else if (typeof value === 'string' || typeof value === 'number') {
    valueArr = [value.toString()];
  }

  if (valueArr.length === 0) {
    return false;
  }

  return `${field}${not ? ' not' : ''} in (${valueArr.map(v => `'${v.trim()}'`).join(', ')})`;
};

export const formatBetween = (rule: Rule, not = false) => {
  const { field, value } = rule;
  let valueArr: string[] = [];
  if (typeof value === 'string') {
    valueArr = value.split(',').map(v => v.trim());
  }

  if (valueArr.length < 2) {
    return false;
  }

  if (isDate(valueArr[0]) && isDate(valueArr[1])) {
    return `${field}${not ? ' not' : ''} between DATE '${valueArr[0]}' and '${valueArr[1]}'`;
  }

  return `${field}${not ? ' not' : ''} between '${valueArr[0]}' and '${valueArr[1]}'`;
};

const parseRule = (rule: Rule, params?: QueryBuilderParams) => {
  if (!rule.isBinding) {
    return rule;
  }

  return { ...rule, value: get(params, rule.value, rule.value) } as Rule;
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
      return !formatContains(rule, true);
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
    case 'notBetween':
      return formatBetween(rule, true);
    default:
      return false;
  }
};

function formatterSql(query: RuleGroup, granulated: false, params?: QueryBuilderParams): string;
function formatterSql(query: RuleGroup, granulated?: boolean, params?: QueryBuilderParams): string[];
function formatterSql(
  query?: RuleGroup,
  granulated: boolean = true,
  params: QueryBuilderParams = {}
): string | string[] {
  if (!query) {
    return '';
  }

  const { combinator, rules, enabled } = query;
  if (!Array.isArray(rules) || enabled === false) {
    return '';
  }

  const content = rules
    .filter(rule => rule.enabled !== false)
    .map(rule => {
      if ('rules' in rule) {
        return `(${granulated ? formatterSql(rule, granulated, params).toString() : formatterSql(rule, granulated, params)})`;
      }

      return formatField(rule, params);
    }) as string[];

  if (!granulated) {
    return content.join(` ${combinator} `);
  }

  return content;
}

export default formatterSql;
