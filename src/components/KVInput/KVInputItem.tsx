import { memo, useCallback, useMemo, useState } from 'react';

import { omit } from '@/helpers/lodash';
import Button from '@components/Button';
import Input from '@components/Input';
import Select from '@components/Select';
import useTheme from '@hooks/useTheme';

import type KVInputStyles from './KVInput.styles';
import type { variantKeys } from './KVInput.styles';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type KVInputItemProps = {
  id: number;
  valueKey?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  isNewRecord?: boolean;
  allowAppend?: boolean;
  allowRemove?: boolean;
  allowKeyEdit?: boolean;
  keysAllowed?: string[];
  onChange?: (
    originalKey: string,
    partialKey: string,
    partialValue: string,
    id: number
  ) => { success: boolean; errors?: { [key: string]: string } };
  onRemove?: (id: number) => void;
} & useThemeSharedProps<typeof KVInputStyles & typeof InputStyles, typeof variantKeys>;

const KVInputItem = ({
  id,
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
  keysAllowed,
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

  const hasChanges = useMemo(
    () => !isNewRecord && (value !== tempValue || valueKey !== tempValueKey),
    [isNewRecord, value, tempValue, valueKey, tempValueKey]
  );

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

  const handleClickRemove = useCallback(() => onRemove?.(id), [onRemove, id]);

  const handleClickCancel = useCallback(() => {
    setErrors(undefined);
    setTempValueKey(valueKey);
    setTempValue(value);
  }, [valueKey, value]);

  const handleClickSave = useCallback(() => {
    const nextErrors: { valueKey?: string; value?: string } = {};

    if (!tempValueKey) {
      nextErrors.valueKey = 'Key is required';
    }

    if (!tempValue && required) {
      nextErrors.value = 'Value is required';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const result = onChange?.(valueKey, tempValueKey, tempValue, id);

    if (!result?.success && result?.errors) {
      setErrors(result.errors);
      return;
    }

    setErrors({});

    if (isNewRecord) {
      setTempValueKey('');
      setTempValue('');
    }
  }, [tempValueKey, tempValue, required, onChange, valueKey, id, isNewRecord]);

  const handleClickClear = useCallback(() => {
    const result = onChange?.(valueKey, tempValueKey, '', id);

    if (!result?.success && result?.errors) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
  }, [id, onChange, tempValueKey, valueKey]);

  return (
    <div className={classNameTheme.item}>
      <div className="flex grow basis-0 gap-2">
        {(!keysAllowed || !keysAllowed.length) && (
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
        )}
        {keysAllowed && keysAllowed.length > 0 && (
          <Select
            size={size}
            className={{
              ...classNameTheme,
              root: classNameTheme.rootInput,
              inputContainer: classNameTheme.rootInputContainer
            }}
            value={tempValueKey}
            disabled={disabled || !allowKeyEdit}
            required={required}
            placeholder="Value"
            error={errors?.valueKey}
            onChange={handleChangeKey}
          >
            {keysAllowed.map(key => (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            ))}
          </Select>
        )}
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
      {!disabled &&
        (allowRemove || (allowAppend && isNewRecord) || hasChanges || (clearable && !required && tempValue)) && (
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
              <Button
                className="basis-0 min-w-0 grow"
                intent="primary"
                title="Add"
                size={size}
                onClick={handleClickSave}
              >
                <Button.Icon icon="fa-solid fa-plus" />
              </Button>
            )}
          </div>
        )}
    </div>
  );
};

export default memo(KVInputItem);
