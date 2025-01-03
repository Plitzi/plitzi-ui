// Packages
import classNames from 'classnames';
import { useMemo } from 'react';

// Relatives
import Select from '../Select';
import { defaultOperators } from './helpers/QueryBuilderContants';

// Type
import type { Operator } from './QueryBuilder';

export type RuleOperatorProps = {
  className?: string;
  value?: string;
  operators?: { value: Operator; label: string }[];
  error?: boolean;
  onChange?: (value: string) => void;
};

const RuleOperator = ({ className = '', value = '', operators, error = false, onChange }: RuleOperatorProps) => {
  const operatorsFinal = useMemo(() => {
    if (!Array.isArray(operators) || operators.length === 0) {
      return defaultOperators;
    }

    return operators;
  }, [operators]);

  return (
    <Select
      className={classNames('rounded', className)}
      size="sm"
      placeholder="Operator"
      value={value}
      onChange={onChange}
      error={error}
    >
      {operatorsFinal.map((operator, i) => (
        <option key={i} value={operator.value}>
          {operator.label}
        </option>
      ))}
    </Select>
  );
};

export default RuleOperator;
