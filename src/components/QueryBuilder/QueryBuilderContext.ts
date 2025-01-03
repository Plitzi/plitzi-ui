// Packages
import { createContext } from 'react';

// Types
import type { Combinator, Field, Operator, Rule, RuleGroup, RuleValue } from './QueryBuilder';

export type QueryBuilderContextValue = {
  addGroup: (groupId: string) => void;
  addRule: (groupId: string) => void;
  update: (nodeId: string, rule: Partial<Rule | RuleGroup>) => void;
  updateCombinator: (nodeId: string, combinator: Combinator) => void;
  updateEnabled: (nodeId: string, isEnabled: boolean) => void;
  updateRuleOperator: (nodeId: string, operator: Operator) => void;
  updateRuleValue: (nodeId: string, value: RuleValue) => void;
  remove: (nodeId: string) => void;
  fields: { [key: string]: Field };
  allowDisableRules?: boolean;
  allowSubGroups?: boolean;
  combinators: { value: string; label: string }[];
  error?: boolean;
};

const queryBuilderContextDefaultValue = {
  addGroup: () => {},
  addRule: () => {},
  update: () => {},
  updateCombinator: () => {},
  updateEnabled: () => {},
  updateRuleOperator: () => {},
  updateRuleValue: () => {},
  remove: () => {},
  fields: {},
  allowDisableRules: true,
  allowSubGroups: true,
  combinators: [],
  error: false
};

const QueryBuilderContext = createContext<QueryBuilderContextValue>(queryBuilderContextDefaultValue);

export default QueryBuilderContext;
