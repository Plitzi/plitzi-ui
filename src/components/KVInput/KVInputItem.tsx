import omit from 'lodash/omit';
import { useCallback, useMemo, useState } from 'react';

import useTheme from '@hooks/useTheme';

import Button from '../Button';
import Input from '../Input';

import type KVInputStyles from './KVInput.styles';
import type { variantKeys } from './KVInput.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type KVInputItemProps = {
  valueKey?: string;
  value?: string;
  disabled?: boolean;
  isNewRecord?: boolean;
  onChange?: (
    originalKey: string,
    partialKey: string,
    partialValue: string
  ) => { success: boolean; errors?: { [key: string]: string } };
  onRemove?: (key: string) => void;
} & useThemeSharedProps<typeof KVInputStyles, typeof variantKeys>;

const KVInputItem = ({
  className,
  valueKey = '',
  value = '',
  disabled = false,
  isNewRecord = false,
  size = 'sm',
  onChange,
  onRemove
}: KVInputItemProps) => {
  const classNameTheme = useTheme<typeof KVInputStyles, typeof variantKeys>('KVInput', {
    className,
    componentKey: ['item', 'input'],
    variant: { size }
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
      } else if (value === '') {
        setErrors(state => ({ ...state, value: 'Value is required' }));
      }

      setTempValue(value);
    },
    [errors]
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

    if (!tempValue) {
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
  }, [tempValueKey, tempValue, onChange, valueKey, isNewRecord, value]);

  return (
    <div className={classNameTheme.item}>
      <div className="flex grow basis-0 gap-1">
        <Input
          size={size}
          className={classNameTheme.input}
          value={tempValueKey}
          disabled={disabled}
          required
          error={errors?.valueKey}
          onChange={handleChangeKey}
        />
        <Input
          size={size}
          className={classNameTheme.input}
          value={tempValue}
          disabled={disabled}
          required
          error={errors?.value}
          onChange={handleChangeValue}
        />
      </div>
      {hasChanges && !disabled && (
        <>
          <Button
            className="rounded bg-green-500 hover:bg-green-400 text-white"
            intent="custom"
            size="sm"
            title="Save"
            onClick={handleClickSave}
          >
            <i className="fa-solid fa-check" />
          </Button>
          <Button className="rounded" intent="danger" title="Cancel" size="sm" onClick={handleClickCancel}>
            <i className="fa-solid fa-xmark" />
          </Button>
        </>
      )}
      {!isNewRecord && !hasChanges && !disabled && (
        <Button className="rounded" intent="danger" title="Remove" size="sm" onClick={handleClickRemove}>
          <i className="fa-solid fa-trash" />
        </Button>
      )}
      {isNewRecord && !hasChanges && !disabled && (
        <Button className="rounded" intent="primary" title="Add" size="sm" onClick={handleClickSave}>
          <i className="fa-solid fa-plus" />
        </Button>
      )}
    </div>
  );
};

export default KVInputItem;
