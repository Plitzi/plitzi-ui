import { useCallback } from 'react';

import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import KVInputItem from './KVInputItem';

import type KVInputStyles from './KVInput.styles';
import type { variantKeys } from './KVInput.styles';
import type InputStyles from '@components/Input/Input.styles';
import type { InputContainerProps } from '@components/Input/InputContainer';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type KVInputProps = {
  value?: [string, string][];
  disabled?: boolean;
  onChange?: (value: [string, string][], obj: { [key: string]: string }) => void;
} & Pick<InputContainerProps, 'label' | 'error'> &
  useThemeSharedProps<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>;

const KVInput = ({ className, size, value = [], disabled = false, label, error, onChange }: KVInputProps) => {
  const classNameTheme = useTheme<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>(['Input', 'KVInput'], {
    className,
    variants: { size }
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
    <InputContainer
      className={classNameTheme}
      label={label}
      value={value}
      disabled={disabled}
      error={error}
      size={size}
    >
      <div className="w-full flex flex-col">
        {value.map(([key, itemValue], i) => (
          <KVInputItem
            className={className}
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
          <KVInputItem className={className} onChange={handleChange} onRemove={handleRemove} size={size} isNewRecord />
        )}
      </div>
    </InputContainer>
  );
};

export default KVInput;
