import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

import useTheme from '@hooks/useTheme';

import type { Option, OptionGroup } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type ListItemProps = {
  className?: string;
  label?: string;
  icon?: ReactNode;
  value?: string;
  prefix?: string;
  suffix?: string;
  option?: Exclude<Option, OptionGroup>;
  isSelected?: boolean;
  onChange?: (newValue?: Exclude<Option, OptionGroup>) => void;
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const ListItem = ({
  className = '',
  label = '',
  icon,
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

  const labelParsed = useMemo(() => {
    const labelArr = [];
    if (prefix) {
      labelArr.push(prefix);
    }

    if (label) {
      labelArr.push(label);
    }

    if (suffix) {
      labelArr.push(suffix);
    }

    return labelArr.join(' ');
  }, [label, prefix, suffix]);

  return (
    <div className={clsx('select2__list-item', className)} onClick={handleClick}>
      {icon}
      {labelParsed}
    </div>
  );
};

export default ListItem;
