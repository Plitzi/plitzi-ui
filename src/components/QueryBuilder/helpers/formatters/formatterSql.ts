import { isDate } from '@/helpers/formatDate';
import { get } from '@/helpers/lodash';

import { isNumeric } from '../QueryBuilderHelper';

import type { QueryBuilderParams, Rule, RuleGroup } from '../../QueryBuilder';

// SECURITY: SQL string literal escape. Doubles single quotes per SQL standard so
// `O'Brien` becomes `O''Brien` and cannot break out of the surrounding `'...'`.
// NOT a substitute for parameterized queries — callers should still pass the output
// through a prepared statement layer when concatenating.
const sqlEscape = (s: unknown): string => String(s ?? '').replace(/'/g, "''");

// SECURITY: SQL identifier whitelist. Only allows `[A-Za-z_][\w.]*` so identifiers like
// `users`, `users.id`, `_meta_v2` pass while `name; DROP TABLE` or `name); --` are rejected.
// Returns empty string when invalid → caller emits a falsy fragment that won't form valid SQL.
const SQL_IDENT_RE = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
const sqlIdent = (s: unknown): string => {
  const v = String(s ?? '');
  return SQL_IDENT_RE.test(v) ? v : '';
};

// SECURITY: SQL operator whitelist — only these literal operators may render verbatim.
const SQL_OPERATOR_WHITELIST = new Set(['=', '!=', '<>', '<', '>', '<=', '>=']);
const sqlOperator = (s: unknown): string => {
  const v = String(s ?? '');
  return SQL_OPERATOR_WHITELIST.has(v) ? v : '';
};

export const formatBasic = (rule: Rule) => {
  const { value } = rule;
  const field = sqlIdent(rule.field);
  const operator = sqlOperator(rule.operator);
  if (!field || !operator) return '';

  if (typeof value === 'boolean') {
    return `${field} ${operator} ${value ? 'TRUE' : 'FALSE'}`;
  }

  if (typeof value === 'string' && !isNumeric(value)) {
    return `${field} ${operator} '${sqlEscape(value)}'`;
  }

  if (typeof value === 'number' || isNumeric(value)) {
    return `${field} ${operator} ${Number(value)}`;
  }

  if (isDate(value)) {
    return `${field} ${operator} DATE '${sqlEscape(value)}'`;
  }

  return `${field} ${operator} '${sqlEscape(JSON.stringify(value))}'`;
};

export const formatContains = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return '';
  return `${field}${not ? ' not' : ''} like '%${sqlEscape(rule.value)}%'`;
};

export const formatBeginsWith = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return '';
  return `${field}${not ? ' not' : ''} like '${sqlEscape(rule.value)}%'`;
};

export const formatEndsWith = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return '';
  return `${field}${not ? ' not' : ''} like '%${sqlEscape(rule.value)}'`;
};

export const formatEmpty = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return '';
  return `${field} is${not ? ' not' : ''} NULL`;
};

export const formatIn = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return false;
  const { value } = rule;
  let valueArr: string[] = [];
  if (typeof value === 'string' && value.includes(',')) {
    valueArr = value.split(',');
  } else if (typeof value === 'string' || typeof value === 'number') {
    valueArr = [value.toString()];
  }

  if (valueArr.length === 0) {
    return false;
  }

  return `${field}${not ? ' not' : ''} in (${valueArr.map(v => `'${sqlEscape(v.trim())}'`).join(', ')})`;
};

export const formatBetween = (rule: Rule, not = false) => {
  const field = sqlIdent(rule.field);
  if (!field) return false;
  const { value } = rule;
  let valueArr: string[] = [];
  if (typeof value === 'string') {
    valueArr = value.split(',').map(v => v.trim());
  }

  if (valueArr.length < 2) {
    return false;
  }

  if (isDate(valueArr[0]) && isDate(valueArr[1])) {
    return `${field}${not ? ' not' : ''} between DATE '${sqlEscape(valueArr[0])}' and '${sqlEscape(valueArr[1])}'`;
  }

  return `${field}${not ? ' not' : ''} between '${sqlEscape(valueArr[0])}' and '${sqlEscape(valueArr[1])}'`;
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
