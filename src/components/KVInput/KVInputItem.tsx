import { memo, useCallback, useMemo, useState } from 'react';

import { omit } from '@/helpers/lodash';
import Button from '@components/Button';
import Input from '@components/Input';
import useTheme from '@hooks/useTheme';

import type KVInputStyles from './KVInput.styles';
import type { variantKeys } from './KVInput.styles';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type KVInputItemProps = {
  valueKey?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  isNewRecord?: boolean;
  allowAppend?: boolean;
  allowRemove?: boolean;
  allowKeyEdit?: boolean;
  onChange?: (
    originalKey: string,
    partialKey: string,
    partialValue: string
  ) => { success: boolean; errors?: { [key: string]: string } };
  onRemove?: (key: string) => void;
} & useThemeSharedProps<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>;

const KVInputItem = ({
  className,
  valueKey = '',
  value = '',
  disabled = false,
  clearable = false,
  isNewRecord = false,
  size = 'md',
  required = true,
  allowAppend = true,
  allowRemove = true,
  allowKeyEdit = true,
  onChange,
  onRemove
}: KVInputItemProps) => {
  const classNameTheme = useTheme<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>(['Input', 'KVInput'], {
    className,
    componentKey: ['item', 'itemActions', 'input', 'rootInputContainer', 'rootInput'],
    variants: { size }
  });
  const [tempValueKey, setTempValueKey] = useState(valueKey);
  const [tempValue, setTempValue] = useState(value);
  const [errors, setErrors] = useState<{ valueKey?: string; value?: string } | undefined>();

  const hasChanges = useMemo(() => {
    if (isNewRecord) {
      return false;
    }

    return value !== tempValue || valueKey !== tempValueKey;
  }, [isNewRecord, value, tempValue, valueKey, tempValueKey]);

  const handleChangeKey = useCallback(
    (value: string) => {
      if (errors?.valueKey) {
        setErrors(omit(errors, 'valueKey'));
      } else if (value === '') {
        setErrors(state => ({ ...state, valueKey: 'Key is required' }));
      }

      setTempValueKey(value);
    },
    [errors]
  );

  const handleChangeValue = useCallback(
    (value: string) => {
      if (errors?.value) {
        setErrors(omit(errors, 'value'));
      } else if (value === '' && required) {
        setErrors(state => ({ ...state, value: 'Value is required' }));
      }

      setTempValue(value);
    },
    [errors, required]
  );

  const handleClickRemove = useCallback(() => onRemove?.(valueKey), [onRemove, valueKey]);

  const handleClickCancel = useCallback(() => {
    setErrors(undefined);
    setTempValueKey(valueKey);
    setTempValue(value);
  }, [valueKey, value]);

  const handleClickSave = useCallback(() => {
    const errors: { valueKey?: string; value?: string } = {};
    if (!tempValueKey) {
      errors.valueKey = 'Key is required';
    }

    if (!tempValue && required) {
      errors.value = 'Value is required';
    }

    if (Object.keys(errors).length) {
      setErrors(errors);

      return;
    }

    const { success, errors: newErrors } = onChange?.(valueKey, tempValueKey, tempValue) ?? {};
    if (!success && newErrors && Object.keys(newErrors).length) {
      setErrors(newErrors);

      return;
    }

    setErrors({});
    if (isNewRecord) {
      setTempValueKey('');
      setTempValue('');
    } else {
      setTempValueKey(valueKey);
      setTempValue(value);
    }
  }, [tempValueKey, tempValue, required, onChange, valueKey, isNewRecord, value]);

  const handleClickClear = useCallback(() => {
    const { success, errors: newErrors } = onChange?.(valueKey, tempValueKey, '') ?? {};
    if (!success && newErrors && Object.keys(newErrors).length) {
      setErrors(newErrors);

      return;
    }

    setErrors(state => (state && Object.keys(state).length > 0 ? {} : state));
  }, [onChange, tempValueKey, valueKey]);

  return (
    <div className={classNameTheme.item}>
      <div className="flex grow basis-0 gap-2">
        <Input
          size={size}
          className={{
            ...classNameTheme,
            root: classNameTheme.rootInput,
            inputContainer: classNameTheme.rootInputContainer
          }}
          value={tempValueKey}
          disabled={disabled || !allowKeyEdit}
          required
          error={errors?.valueKey}
          placeholder="Key"
          onChange={handleChangeKey}
        />
        <Input
          size={size}
          className={{
            ...classNameTheme,
            root: classNameTheme.rootInput,
            inputContainer: classNameTheme.rootInputContainer
          }}
          value={tempValue}
          disabled={disabled}
          required={required}
          placeholder="Value"
          error={errors?.value}
          onChange={handleChangeValue}
        />
      </div>
      {!disabled && (allowRemove || (allowAppend && isNewRecord) || hasChanges || (clearable && tempValue)) && (
        <div className={classNameTheme.itemActions}>
          {hasChanges && (
            <>
              <Button
                className="basis-0 min-w-0 grow bg-green-500 hover:bg-green-400 text-white"
                intent="custom"
                size={size}
                title="Save"
                onClick={handleClickSave}
              >
                <Button.Icon icon="fa-solid fa-check" />
              </Button>
              <Button
                className="basis-0 min-w-0 grow"
                intent="danger"
                title="Cancel"
                size={size}
                onClick={handleClickCancel}
              >
                <Button.Icon icon="fa-solid fa-xmark" />
              </Button>
            </>
          )}
          {!isNewRecord && (
            <>
              {!hasChanges && clearable && !required && tempValue && (
                <Button
                  className="basis-0 min-w-0 grow"
                  intent="secondary"
                  title="Clear"
                  size={size}
                  onClick={handleClickClear}
                >
                  <Button.Icon icon="fa-solid fa-eraser" />
                </Button>
              )}
              {!hasChanges && allowRemove && (
                <Button
                  className="basis-0 min-w-0 grow"
                  intent="danger"
                  title="Remove"
                  size={size}
                  onClick={handleClickRemove}
                >
                  <Button.Icon icon="fa-solid fa-trash" />
                </Button>
              )}
            </>
          )}
          {allowAppend && isNewRecord && (
            <Button className="basis-0 min-w-0 grow" intent="primary" title="Add" size={size} onClick={handleClickSave}>
              <Button.Icon icon="fa-solid fa-plus" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(KVInputItem);
