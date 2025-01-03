// Types
import type { Operator } from '../QueryBuilder';

export const defaultOperators: { value: Operator; label: string }[] = [
  { value: '=', label: '= Equals' },
  { value: '!=', label: '!= Does not equal' },
  { value: '<', label: '< Less than' },
  { value: '>', label: '> Greater than' },
  { value: '<=', label: '<= Less than or equal to' },
  { value: '>=', label: '>= Greater than or equal to' },
  { value: 'contains', label: 'Contains' },
  { value: 'beginsWith', label: 'Begins with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'doesNotContain', label: 'Does not contain' },
  { value: 'doesNotBeginWith', label: 'Does not begin with' },
  { value: 'doesNotEndWith', label: 'Does not end with' },
  { value: 'empty', label: 'Is empty' },
  { value: 'notEmpty', label: 'Is not empty' },
  { value: 'in', label: 'In' },
  { value: 'notIn', label: 'Does not in' },
  { value: 'between', label: 'Between' },
  { value: 'notBetween', label: 'Does not between' }
];

export const defaultOperatorNegationMap = {
  '=': '!=',
  '!=': '=',
  '<': '>=',
  '<=': '>',
  '>': '<=',
  '>=': '<',
  beginsWith: 'doesNotBeginWith',
  doesNotBeginWith: 'beginsWith',
  endsWith: 'doesNotEndWith',
  doesNotEndWith: 'endsWith',
  contains: 'doesNotContain',
  doesNotContain: 'contains',
  between: 'notBetween',
  notBetween: 'between',
  in: 'notIn',
  notIn: 'in',
  notEmpty: 'empty',
  empty: 'notEmpty'
};

export const defaultCombinators = [
  { value: 'and', label: 'And' },
  { value: 'or', label: 'Or' }
];

export const defaultCombinatorsExtended = [...defaultCombinators, { value: 'xor', label: 'Xor' }];

export const defaultValidator = (value?: string | number | boolean) => {
  if (!value) {
    return 'This field is required';
  }

  return true;
};
