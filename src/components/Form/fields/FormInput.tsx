/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Input from '@components/Input';

import type { BaseFormFieldType } from '../Form';
import type { InputProps } from '@components/Input';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormInputProps<T extends FieldValues, TName extends FieldPath<T>> = InputProps &
  BaseFormFieldType<T, TName>;

const FormInput = <T extends FieldValues, TName extends FieldPath<T>>(props: FormInputProps<T, TName>) => {
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
          <Input
            {...props}
            ref={ref as unknown as RefObject<HTMLInputElement>}
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

export default FormInput;
