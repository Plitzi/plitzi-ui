// Packages
import { produce } from 'immer';
import get from 'lodash/get';
import noop from 'lodash/noop';
import set from 'lodash/set';
import { useCallback, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';

// Relatives
import { defaultCombinators } from './helpers/QueryBuilderContants';
import { getQueryMap } from './helpers/QueryBuilderHelper';
import QueryBuilderContext from './QueryBuilderContext';
import { emptyObject } from '../../helpers/utils';

// Types
import type { QueryMapNode } from './helpers/QueryBuilderHelper';
import type { Combinator, Field, Operator, QueryBuilderProps, Rule, RuleGroup, RuleValue } from './QueryBuilder';
import type { ReactNode } from 'react';

export type QueryBuilderQueryProviderProps = {
  children: ReactNode;
  query: RuleGroup;
  fields: { [key: string]: Field };
  allowDisableRules: boolean;
  allowSubGroups: boolean;
  combinators: { value: string; label: string }[];
  error?: boolean;
  onChange?: QueryBuilderProps['onChange'];
};

const QueryBuilderProvider = ({
  children,
  query,
  fields = emptyObject,
  allowDisableRules = true,
  allowSubGroups = true,
  combinators = defaultCombinators,
  error = false,
  onChange = noop
}: QueryBuilderQueryProviderProps) => {
  const queryRef = useRef(query);
  queryRef.current = query;

  // utils

  const queryMap = useMemo(() => getQueryMap(query), [query]);
  const queryMapRef = useRef(queryMap);
  queryMapRef.current = queryMap;

  const getNode = useCallback((nodes: RuleGroup, id: string): Rule | RuleGroup | undefined => {
    const node = get(queryMapRef.current, id);
    if (!node) {
      return undefined;
    }

    return get(nodes, node.path) as Rule | RuleGroup | undefined;
  }, []);

  // main methods

  const handleAddRule = useCallback(
    (groupId: string) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, groupId);
          if (!node || !('rules' in node)) {
            return;
          }

          node.rules.push({ id: uuid(), field: '', operator: '', value: '', enabled: true });
        })
      ),
    [onChange, getNode]
  );

  const handleAddGroup = useCallback(
    (groupId: string) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, groupId);
          if (!node || !allowSubGroups || !('rules' in node)) {
            return;
          }

          node.rules.push({
            id: uuid(),
            combinator: get(combinators, '0.value', 'and') as Combinator,
            rules: [{ id: uuid(), field: '', operator: '', value: '', enabled: true }],
            enabled: true
          });
        })
      ),
    [allowSubGroups, combinators, onChange, getNode]
  );

  const handleUpdate = useCallback(
    (nodeId: string, rule: Partial<Rule | RuleGroup>) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, nodeId);
          if (!node) {
            return;
          }

          const { parentId } = get(queryMapRef.current, nodeId, {}) as QueryMapNode;
          const parentNode = getNode(draft, parentId);
          if (!parentNode || !('rules' in parentNode)) {
            return;
          }

          set(parentNode, `rules.${parentNode.rules.findIndex(rule => rule.id === nodeId)}`, { ...node, ...rule });
        })
      ),
    [onChange, getNode]
  );

  const handleUpdateCombinator = useCallback(
    (nodeId: string, combinator: Combinator) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, nodeId);
          if (!node) {
            return;
          }

          set(node, 'combinator', combinator);
        })
      ),
    [onChange, getNode]
  );

  const handleUpdateEnabled = useCallback(
    (nodeId: string, isEnabled: boolean) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, nodeId);
          if (!node) {
            return;
          }

          set(node, 'enabled', isEnabled);
        })
      ),
    [onChange, getNode]
  );

  const handleUpdateRuleOperator = useCallback(
    (nodeId: string, operator: Operator) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, nodeId);
          if (!node) {
            return;
          }

          set(node, 'operator', operator);
        })
      ),
    [onChange, getNode]
  );

  const handleUpdateRuleValue = useCallback(
    (nodeId: string, value: RuleValue) =>
      onChange(
        produce(queryRef.current, draft => {
          const node = getNode(draft, nodeId);
          if (!node) {
            return;
          }

          set(node, 'value', value);
        })
      ),
    [onChange, getNode]
  );

  const handleRemove = useCallback(
    (nodeId: string) =>
      onChange(
        produce(queryRef.current, draft => {
          let node = getNode(draft, nodeId);
          let parentNode;
          while (node) {
            const { id, parentId } = get(queryMapRef.current, node.id ?? '', '') as QueryMapNode;
            parentNode = getNode(draft, parentId);
            if (!parentNode || !('rules' in parentNode)) {
              break;
            }

            parentNode.rules.splice(
              parentNode.rules.findIndex(rule => rule.id === id),
              1
            );

            if (parentNode.rules.length < 2 && parentNode.combinator !== 'and') {
              parentNode.combinator = 'and';
            }

            if (parentNode.rules.length > 0 || !parentId) {
              break;
            }

            node = parentNode;
          }
        })
      ),
    [onChange, getNode]
  );

  const queryBuilderMemo = useMemo(
    () => ({
      addGroup: handleAddGroup,
      addRule: handleAddRule,
      update: handleUpdate,
      updateCombinator: handleUpdateCombinator,
      updateEnabled: handleUpdateEnabled,
      updateRuleOperator: handleUpdateRuleOperator,
      updateRuleValue: handleUpdateRuleValue,
      remove: handleRemove,
      fields,
      allowDisableRules,
      allowSubGroups,
      combinators,
      error
    }),
    [
      handleAddGroup,
      handleAddRule,
      handleUpdate,
      handleUpdateCombinator,
      handleUpdateEnabled,
      handleUpdateRuleOperator,
      handleUpdateRuleValue,
      handleRemove,
      fields,
      allowDisableRules,
      allowSubGroups,
      combinators,
      error
    ]
  );

  return <QueryBuilderContext value={queryBuilderMemo}>{children}</QueryBuilderContext>;
};

export default QueryBuilderProvider;
