/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Checkbox from '@components/Checkbox';

import type { BaseFormFieldType } from '../Form';
import type { CheckboxProps } from '@components/Checkbox';
import type { ChangeEvent, RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormCheckboxProps<T extends FieldValues, TName extends FieldPath<T>> = CheckboxProps &
  BaseFormFieldType<T, TName>;

const FormCheckbox = <T extends FieldValues, TName extends FieldPath<T>>(props: FormCheckboxProps<T, TName>) => {
  const { control } = useFormContext<T>();

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (value: ChangeEvent<HTMLInputElement>) => {
      onChange(value);
      props.onChange?.(value);
    },
    [props]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      ({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
        <Checkbox
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

export default FormCheckbox;
