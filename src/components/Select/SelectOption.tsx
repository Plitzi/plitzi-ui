import type { ReactNode } from 'react';

export type SelectOptionProps = {
  children?: ReactNode;
  value?: string;
};

const SelectOption = ({ children, value }: SelectOptionProps) => <option value={value}>{children}</option>;

export default SelectOption;
