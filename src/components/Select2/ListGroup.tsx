import classNames from 'classnames';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import ListItem from './ListItem';

import type { Option, OptionGroup, Select2Props } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type ListGroupProps = {
  options?: Exclude<Option, OptionGroup>[];
  label?: string;
  value?: string;
  onChange?: Select2Props['onChange'];
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const ListGroup = ({ className, options, label = '', value = '', size, onChange }: ListGroupProps) => {
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: ['listGroup', 'listGroupLabel'],
    variant: { size }
  });

  return (
    <Flex direction="column" className={classNames('select2__list-group', classNameTheme.listGroup)}>
      <div className={classNameTheme.listGroupLabel}>{label}</div>
      {options &&
        options.map((option, index) => (
          <ListItem
            key={index}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            option={option}
            size={size}
            onChange={onChange}
          />
        ))}
    </Flex>
  );
};

export default ListGroup;
