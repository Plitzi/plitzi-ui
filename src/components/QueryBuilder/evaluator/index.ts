/**
 * The rule evaluator alone — what decides whether a value bag satisfies a rule group — for code that evaluates rules
 * and draws none: a server, a runtime, a store. `@plitzi/plitzi-ui/QueryBuilder` brings the editor's React components
 * with it, and `QueryBuilder/helpers` the SQL and MongoDB formatters; this brings neither.
 */
export { default as QueryBuilderEvaluator } from '../helpers/QueryBuilderEvaluator';
export * from '../helpers/QueryBuilderEvaluator';
export { isNumeric, isRuleGroup } from '../helpers/QueryBuilderHelper';

export type { Rule, RuleGroup, RuleValue } from '../QueryBuilder';
