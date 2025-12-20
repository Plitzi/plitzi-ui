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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const onChangeMemo = useMemo(() => handleChange(onChange), [onChange, handleChange]);

        return (
          <TextArea
            {...props}
            ref={ref as unknown as RefObject<HTMLTextAreaElement>}
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

export default FormTextArea;
