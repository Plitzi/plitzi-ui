import { useCallback } from 'react';

import useTheme from '@hooks/useTheme';

import KVInputItem from './KVInputItem';

import type KVInputStyles from './KVInput.styles';
import type { variantKeys } from './KVInput.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type KVInputProps = {
  value?: [string, string][];
  disabled?: boolean;
  onChange?: (value: [string, string][], obj: { [key: string]: string }) => void;
} & useThemeSharedProps<typeof KVInputStyles, typeof variantKeys>;

const KVInput = ({ className, size, value = [], disabled = false, onChange }: KVInputProps) => {
  const classNameTheme = useTheme<typeof KVInputStyles, typeof variantKeys>('KVInput', {
    className,
    componentKey: ['root'],
    variant: {}
  });

  const handleChange = useCallback(
    (
      originalKey: string,
      partialKey: string,
      partialValue: string
    ): { success: boolean; errors?: { [key: string]: string } } => {
      const itemPartial = value.find(([key]) => key === partialKey);
      if (partialKey !== originalKey && itemPartial) {
        return { success: false, errors: { valueKey: 'Key already exists' } };
      }

      let newValue = value;
      if (partialKey && originalKey) {
        newValue = newValue.map(([k, v]) => {
          if (k === originalKey) {
            return [partialKey, partialValue];
          }

          return [k, v];
        });
      } else {
        newValue = [...newValue, [partialKey, partialValue]];
      }

      onChange?.(
        newValue,
        newValue.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      );

      return { success: true, errors: undefined };
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (partialKey: string) => {
      const newValue = value.filter(([key]) => key !== partialKey);

      onChange?.(
        newValue,
        newValue.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      );
    },
    [onChange, value]
  );

  return (
    <div className={classNameTheme.root}>
      {value.map(([key, itemValue], i) => (
        <KVInputItem
          className={typeof className === 'string' ? className : className?.input}
          key={`${i}-${key}-${itemValue}`}
          valueKey={key}
          value={itemValue}
          disabled={disabled}
          size={size}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      {!disabled && (
        <KVInputItem
          className={typeof className === 'string' ? className : className?.input}
          onChange={handleChange}
          onRemove={handleRemove}
          isNewRecord
        />
      )}
    </div>
  );
};

export default KVInput;
