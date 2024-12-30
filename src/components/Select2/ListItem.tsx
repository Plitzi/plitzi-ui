// Packages
import classNames from 'classnames';
import { useCallback } from 'react';

// Types
import type { Option, OptionGroup, Select2Props } from './Select2';

export type ListItemProps = {
  className?: string;
  label?: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  option?: Exclude<Option, OptionGroup>;
  isSelected?: boolean;
  onChange?: Select2Props['onChange'];
};

const ListItem = ({
  className = '',
  label = '',
  value = '',
  prefix = '',
  suffix = '',
  option,
  isSelected = false,
  onChange
}: ListItemProps) => {
  const handleClick = useCallback(() => {
    if (option) {
      onChange?.(option);

      return;
    }

    onChange?.({ value, label });
  }, [option, onChange, value, label]);

  return (
    <div
      className={classNames(
        'my-0.5 select2__list-item shrink-0 transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded',
        { 'text-gray-500 hover:bg-blue-100 hover:text-blue-500': !isSelected },
        { 'bg-blue-100 text-blue-500': isSelected },
        className
      )}
      onClick={handleClick}
    >
      {`${prefix ? `${prefix} ` : ''}${label ? label : value}${suffix ? ` ${suffix}` : ''}`}
    </div>
  );
};

export default ListItem;
