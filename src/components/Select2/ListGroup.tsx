// Relatives
import ListItem from './ListItem';

// Types
import type { Option, OptionGroup, Select2Props } from './Select2';

export type ListGroupProps = {
  options?: Exclude<Option, OptionGroup>[];
  label?: string;
  value?: string;
  onChange?: Select2Props['onChange'];
};

const ListGroup = ({ options, label = '', value = '', onChange }: ListGroupProps) => {
  return (
    <div className="select2__list-group flex flex-col not-last:border-b not-last:border-gray-300 not-last:pb-2 not-last:mb-2">
      <div className="pr-2 py-2 cursor-default select-none truncate font-bold text-gray-700">{label}</div>
      {options &&
        options.map((option, index) => (
          <ListItem
            key={index}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onChange={onChange}
            option={option}
          />
        ))}
    </div>
  );
};

export default ListGroup;
