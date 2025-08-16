import classNames from 'classnames';

import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import ListItem from './ListItem';

import type { Option, OptionGroup } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type ListGroupProps = {
  options?: Exclude<Option, OptionGroup>[];
  icon?: ReactNode;
  label?: string;
  value?: string;
  onChange?: (newValue?: Exclude<Option, OptionGroup>) => void;
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const ListGroup = ({ className, options, icon, label = '', value = '', size, onChange }: ListGroupProps) => {
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: ['listGroup', 'listGroupLabel'],
    variants: { size }
  });

  return (
    <Flex direction="column" className={classNames('select2__list-group', classNameTheme.listGroup)}>
      <div className={classNameTheme.listGroupLabel}>
        {icon}
        {label}
      </div>
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
