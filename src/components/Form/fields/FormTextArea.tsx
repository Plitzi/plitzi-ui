/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextArea from '@components/TextArea';

import type { BaseFormFieldType } from '../Form';
import type { TextAreaProps } from '@components/TextArea';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormTextAreaProps<T extends FieldValues, TName extends FieldPath<T>> = TextAreaProps &
  BaseFormFieldType<T, TName>;

const FormTextArea = <T extends FieldValues, TName extends FieldPath<T>>(props: FormTextAreaProps<T, TName>) => {
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
        <TextArea
          {...props}
          ref={ref as unknown as RefObject<HTMLTextAreaElement>}
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

export default FormTextArea;
