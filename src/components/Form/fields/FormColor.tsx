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
          <ColorPicker
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

export default FormColor;
