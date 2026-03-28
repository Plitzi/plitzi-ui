import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import type { Option, OptionGroup } from './Select2';
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode } from 'react';

export type ListItemProps = {
  className?: string;
  label?: string;
  icon?: ReactNode;
  value?: string;
  prefix?: string;
  suffix?: string;
  option?: Exclude<Option, OptionGroup>;
  isSelected?: boolean;
  allowRemoveOptions?: boolean;
  onChange?: (newValue?: Exclude<Option, OptionGroup>) => void;
  onRemove?: (value: Exclude<Option, OptionGroup>) => void;
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
  allowRemoveOptions = false,
  size,
  onChange,
  onRemove
}: ListItemProps) => {
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: ['listItem', 'listItemIcon'],
    variants: { size, selected: isSelected }
  });

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (option) {
        onChange?.(option);

        return;
      }

      onChange?.({ label, value });
    },
    [option, onChange, label, value]
  );

  const handleClickRemove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (option) {
        onRemove?.(option);
      }
    },
    [onRemove, option]
  );

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
    <div data-value={value} className={clsx('select2__list-item', classNameTheme.listItem)} onClick={handleClick}>
      <div className="flex items-center">
        {icon}
        {labelParsed}
      </div>
      {allowRemoveOptions && (
        <Icon
          className={classNameTheme.listItemIcon}
          intent="danger"
          icon="fa-solid fa-circle-xmark"
          title="Remove"
          onClick={handleClickRemove}
        />
      )}
    </div>
  );
};

export default ListItem;
