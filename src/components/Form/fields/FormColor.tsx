/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import ColorPicker from '@components/ColorPicker';

import type { BaseFormFieldType } from '../Form';
import type { ColorPickerProps } from '@components/ColorPicker';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormColorProps<T extends FieldValues, TName extends FieldPath<T>> = ColorPickerProps &
  BaseFormFieldType<T, TName>;

const FormColor = <T extends FieldValues, TName extends FieldPath<T>>(props: FormColorProps<T, TName>) => {
  const { control } = useFormContext<T>();

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (value: string) => {
      onChange(value);
      props.onChange?.(value);
    },
    [props]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      ({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
        <ColorPicker
          {...props}
          ref={ref as unknown as RefObject<HTMLInputElement>}
          value={value}
          name={name}
          error={fieldError?.message}
          onChange={handleChange(onChange)}
        />
      ),
    [props, handleChange]
  );

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormColor;
