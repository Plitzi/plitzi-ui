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
  id?: string;
  value?: [string, string][];
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  allowAppend?: boolean;
  allowRemove?: boolean;
  allowKeyEdit?: boolean;
  allowDuplicateKeys?: boolean;
  keysAllowed?: string[];
  onChange?: (value: [string, string][], obj: { [key: string]: string }) => void;
} & Pick<InputContainerProps, 'label' | 'error'> &
  useThemeSharedProps<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>;

const KVInput = ({
  className,
  id,
  size,
  value = [],
  disabled = false,
  label,
  error,
  required = true,
  clearable = false,
  allowAppend = true,
  allowRemove = true,
  allowKeyEdit = true,
  allowDuplicateKeys = false,
  keysAllowed,
  onChange
}: KVInputProps) => {
  const classNameTheme = useTheme<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>(['Input', 'KVInput'], {
    className,
    variants: { size }
  });

  const handleChange = useCallback(
    (
      originalKey: string,
      partialKey: string,
      partialValue: string,
      index: number
    ): { success: boolean; errors?: { [key: string]: string } } => {
      if (!allowDuplicateKeys) {
        const exists = value.some(([key], i) => key === partialKey && i !== index);
        if (partialKey !== originalKey && exists) {
          return { success: false, errors: { valueKey: 'Key already exists' } };
        }
      }

      let newValue: [string, string][];
      if (originalKey) {
        // update existing
        newValue = value.map((item, i) => (i === index ? [partialKey, partialValue] : item));
      } else {
        // append new
        newValue = [...value, [partialKey, partialValue]];
      }

      onChange?.(newValue, Object.fromEntries(newValue));

      return { success: true };
    },
    [value, allowDuplicateKeys, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (!allowRemove) {
        return;
      }

      const newValue = value.filter((_, i) => i !== index);
      const obj = Object.fromEntries(newValue);
      onChange?.(newValue, obj);
    },
    [value, allowRemove, onChange]
  );

  return (
    <InputContainer
      className={classNameTheme}
      id={id}
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
            id={i}
            valueKey={key}
            value={itemValue}
            disabled={disabled}
            size={size}
            required={required}
            clearable={clearable}
            allowAppend={false}
            allowRemove={allowRemove}
            allowKeyEdit={allowKeyEdit}
            keysAllowed={keysAllowed}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}
        {!disabled && allowAppend && (
          <KVInputItem
            id={value.length}
            className={className}
            onChange={handleChange}
            size={size}
            allowAppend={allowAppend}
            allowRemove={false}
            allowKeyEdit={true}
            keysAllowed={keysAllowed}
            isNewRecord
          />
        )}
      </div>
    </InputContainer>
  );
};

export default KVInput;
