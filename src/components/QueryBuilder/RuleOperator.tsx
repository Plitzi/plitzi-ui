import { useMemo } from 'react';

import useTheme from '@hooks/useTheme';

// Relatives
import Select from '../Select';
import { defaultOperators } from './helpers/QueryBuilderContants';

// Type
import type { Operator } from './QueryBuilder';
import type QueryBuilderStyles from './QueryBuilder.styles';
import type { variantKeys } from './QueryBuilder.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type RuleOperatorProps = {
  value?: string;
  operators?: { value: Operator; label: string }[];
  error?: boolean;
  onChange?: (value: string) => void;
} & useThemeSharedProps<typeof QueryBuilderStyles, typeof variantKeys>;

const RuleOperator = ({ className = '', value = '', operators, error = false, size, onChange }: RuleOperatorProps) => {
  className = useTheme<typeof QueryBuilderStyles, typeof variantKeys>('QueryBuilder', {
    className,
    componentKey: 'ruleOperator',
    variant: { size }
  });
  const operatorsFinal = useMemo(() => {
    if (!Array.isArray(operators) || operators.length === 0) {
      return defaultOperators;
    }

    return operators;
  }, [operators]);

  return (
    <Select className={className} placeholder="Operator" value={value} error={error} size={size} onChange={onChange}>
      {operatorsFinal.map((operator, i) => (
        <option key={i} value={operator.value}>
          {operator.label}
        </option>
      ))}
    </Select>
  );
};

export default RuleOperator;
