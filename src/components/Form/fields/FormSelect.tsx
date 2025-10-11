/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Select from '@components/Select';

import type { BaseFormFieldType } from '../Form';
import type { SelectProps } from '@components/Select';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormSelectProps<T extends FieldValues, TName extends FieldPath<T>> = SelectProps &
  BaseFormFieldType<T, TName>;

const FormSelect = <T extends FieldValues, TName extends FieldPath<T>>(props: FormSelectProps<T, TName>) => {
  const { control } = useFormContext<T>();
  const { onChange: onChangeProp } = props;

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (value: string) => {
      onChange(value);
      onChangeProp?.(value);
    },
    [onChangeProp]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      function Render({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) {
        const onChangeMemo = useMemo(() => handleChange(onChange), [onChange]);

        return (
          <Select
            {...props}
            ref={ref as unknown as RefObject<HTMLSelectElement>}
            value={value}
            name={name}
            error={fieldError?.message}
            onChange={onChangeMemo}
          />
        );
      },
    [props, handleChange]
  );

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormSelect;
