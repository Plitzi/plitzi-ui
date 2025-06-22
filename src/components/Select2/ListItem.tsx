import classNames from 'classnames';
import { useCallback } from 'react';

import useTheme from '@hooks/useTheme';

import type { Option, OptionGroup, Select2Props } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type ListItemProps = {
  className?: string;
  label?: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  option?: Exclude<Option, OptionGroup>;
  isSelected?: boolean;
  onChange?: Select2Props['onChange'];
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const ListItem = ({
  className = '',
  label = '',
  value = '',
  prefix = '',
  suffix = '',
  option,
  isSelected = false,
  size,
  onChange
}: ListItemProps) => {
  className = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: 'listItem',
    variants: { size, selected: isSelected }
  });

  const handleClick = useCallback(() => {
    if (option) {
      onChange?.(option);

      return;
    }

    onChange?.({ value, label });
  }, [option, onChange, value, label]);

  return (
    <div className={classNames('select2__list-item', className)} onClick={handleClick}>
      {`${prefix ? `${prefix} ` : ''}${label ? label : value}${suffix ? ` ${suffix}` : ''}`}
    </div>
  );
};

export default ListItem;
