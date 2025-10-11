/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import FileUpload from '@components/FileUpload';

import type { BaseFormFieldType } from '../Form';
import type { FileUploadProps } from '@components/FileUpload';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormFileUploadProps<T extends FieldValues, TName extends FieldPath<T>> = FileUploadProps &
  BaseFormFieldType<T, TName>;

const FormFileUpload = <T extends FieldValues, TName extends FieldPath<T>>(props: FormFileUploadProps<T, TName>) => {
  const { control, setError, clearErrors } = useFormContext<T>();
  const { multiple, name, onChange: onChangeProp } = props;

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (value?: File | File[]) => {
      onChange(value);
      if (multiple) {
        onChangeProp?.(value as File[] | undefined);
      } else {
        onChangeProp?.(value as File | undefined);
      }

      if (name) {
        clearErrors(name);
      }
    },
    [clearErrors, multiple, name, onChangeProp]
  );

  const handleError = useCallback(
    (error?: string) => {
      if (error) {
        setError(props.name, { type: 'custom', message: error });
      }
    },
    [props.name, setError]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      function Render({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) {
        const onChangeMemo = useMemo(() => handleChange(onChange), [onChange]);

        return (
          <FileUpload
            {...props}
            ref={ref as unknown as RefObject<HTMLInputElement>}
            value={value}
            name={name}
            error={fieldError?.message}
            onChange={onChangeMemo}
            onError={handleError}
          />
        );
      },
    [props, handleChange, handleError]
  );

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormFileUpload;
