// Packages
import get from 'lodash/get';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

// Alias
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Relatives
import GroupRules from './GroupRules';
import { defaultCombinators } from './helpers/QueryBuilderContants';
import QueryBuilderProvider from './QueryBuilderProvider';
import { emptyObject } from '../../helpers/utils';

// Types
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type RuleValue = Date | string | number | boolean | undefined | null | object;

export type QueryBuilderParams = {
  [key: string]: RuleValue;
};

export type Combinator = 'and' | 'or';

export type Operator =
  | ''
  | '='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | 'contains'
  | 'doesNotContain'
  | 'beginsWith'
  | 'doesNotBeginWith'
  | 'endsWith'
  | 'doesNotEndWith'
  | 'empty'
  | 'notEmpty'
  | 'in'
  | 'notIn'
  | 'between'
  | 'notBetween';

export type RuleGroup = {
  id?: string;
  combinator: Combinator;
  rules: (Rule | RuleGroup)[];
  enabled?: boolean;
};

export type Rule = {
  id?: string;
  field: string;
  operator: Operator;
  enabled?: boolean;
} & ({ isBinding: true; value: string } | { isBinding?: false; value: RuleValue });

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  defaultOperator?: Operator;
  operators?: { value: Operator; label: string }[];
  group?: string;
  inputType?:
    | 'checkbox'
    | 'radio'
    | 'multiselect'
    | 'select'
    | 'text'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime'
    | 'textarea';
  defaultValue?: RuleValue;
  validator?: (value?: string | number | boolean) => boolean | string;
  options?: { value: RuleValue; label: string }[];
};

export type QueryBuilderProps = {
  query?: RuleGroup;
  fields?: { [key: string]: Field };
  showBranches?: boolean;
  allowDisableRules?: boolean;
  allowSubGroups?: boolean;
  combinators?: { value: string; label: string }[];
  error?: boolean;
  onChange?: (query: RuleGroup) => void;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const QueryBuilder = ({
  className = '',
  query,
  fields = emptyObject,
  showBranches = false,
  allowDisableRules = true,
  allowSubGroups = true,
  combinators = defaultCombinators,
  error = false,
  size = 'xs',
  direction = 'horizontal',
  onChange
}: QueryBuilderProps) => {
  className = useTheme<typeof QueryBuilderStyles, typeof variantKeys>('QueryBuilder', {
    className,
    componentKey: 'root',
    variant: { size }
  });
  const queryMemo = useMemo<RuleGroup>(() => {
    if (!query || !query.id) {
      return { id: uuid(), combinator: get(combinators, '0.value', 'and') as Combinator, rules: [], enabled: true };
    }

    return query;
  }, [query, combinators]);

  const { id, combinator, enabled, rules } = queryMemo;

  return (
    <Flex direction="column" className={className}>
      <QueryBuilderProvider
        query={queryMemo}
        fields={fields}
        onChange={onChange}
        allowDisableRules={allowDisableRules}
        allowSubGroups={allowSubGroups}
        combinators={combinators}
        error={error}
      >
        <GroupRules
          id={id}
          combinator={combinator}
          enabled={enabled}
          rules={rules}
          showBranches={showBranches}
          mainGroup
          direction={direction}
          size={size}
        />
      </QueryBuilderProvider>
    </Flex>
  );
};

export default QueryBuilder;
