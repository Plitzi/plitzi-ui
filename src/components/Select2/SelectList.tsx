import clsx from 'clsx';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import { isOptionGroup } from './helpers/utils';
import ListGroup from './ListGroup';
import ListItem from './ListItem';

import type { Option, OptionGroup } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type SelectListProps = {
  className?: string;
  options?: Option[];
  value?: string;
  onChange?: (newValue?: Exclude<Option, OptionGroup>) => void;
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const SelectList = ({ className = '', options, value = '', size, onChange }: SelectListProps) => {
  className = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: 'list',
    variants: { size }
  });

  return (
    <Flex direction="column" className={clsx('select2__list', className)}>
      {options?.map((option, index) => {
        const { label, icon } = option;
        if (isOptionGroup(option)) {
          return (
            <ListGroup
              key={index}
              label={label}
              icon={icon}
              options={option.options}
              value={value}
              size={size}
              onChange={onChange}
            />
          );
        }

        return (
          <ListItem
            key={index}
            isSelected={value === option.value}
            label={label}
            icon={icon}
            value={option.value}
            option={option}
            size={size}
            onChange={onChange}
          />
        );
      })}
    </Flex>
  );
};

export default SelectList;
