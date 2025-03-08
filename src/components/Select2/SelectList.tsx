import classNames from 'classnames';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import { isOptionGroup } from './helpers/utils';
import ListGroup from './ListGroup';
import ListItem from './ListItem';

import type { Option, Select2Props } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type SelectListProps = {
  className?: string;
  options?: Option[];
  value?: string;
  onChange?: Select2Props['onChange'];
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;
const optionsDefault: Option[] = [];

const SelectList = ({ className = '', options = optionsDefault, value = '', size, onChange }: SelectListProps) => {
  className = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: 'list',
    variant: { size }
  });

  return (
    <Flex direction="column" className={classNames('select2__list', className)}>
      {options.map((option, index) => {
        const { label } = option;
        if (isOptionGroup(option)) {
          return (
            <ListGroup
              key={index}
              label={label}
              options={option.options}
              value={value}
              size={size}
              onChange={onChange}
            />
          );
        }

        const { value: optionValue } = option;

        return (
          <ListItem
            key={index}
            isSelected={value === optionValue}
            label={label}
            value={optionValue}
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
