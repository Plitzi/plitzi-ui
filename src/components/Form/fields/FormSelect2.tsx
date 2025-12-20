/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Select2 from '@components/Select2';

import type { BaseFormFieldType } from '../Form';
import type { Option, OptionGroup, Select2Props } from '@components/Select2';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormSelect2Props<T extends FieldValues, TName extends FieldPath<T>> = Select2Props &
  BaseFormFieldType<T, TName>;

const FormSelect2 = <T extends FieldValues, TName extends FieldPath<T>>(props: FormSelect2Props<T, TName>) => {
  const { control } = useFormContext<T>();
  const { valueAsString, onChange: onChangeProp } = props;

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (value: any) => {
      onChange(value);
      if (valueAsString) {
        onChangeProp?.(value as string);
      } else {
        onChangeProp?.(value as Exclude<Option, OptionGroup>);
      }
    },
    [valueAsString, onChangeProp]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      function Render({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const onChangeMemo = useMemo(() => handleChange(onChange), [onChange, handleChange]);

        return (
          <Select2
            {...props}
            ref={ref as unknown as RefObject<HTMLDivElement | null>}
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

export default FormSelect2;
