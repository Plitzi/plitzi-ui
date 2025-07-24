import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Select2 from '@components/Select2';

import type { BaseFormFieldType } from '../Form';
import type { Select2Props } from '@components/Select2';
import type { RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormSelect2Props<T extends FieldValues, TName extends FieldPath<T>> = Select2Props &
  BaseFormFieldType<T, TName>;

const FormSelect2 = <T extends FieldValues, TName extends FieldPath<T>>(props: FormSelect2Props<T, TName>) => {
  const { control } = useFormContext<T>();

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      ({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
        <Select2
          {...props}
          ref={ref as unknown as RefObject<HTMLDivElement | null>}
          value={value}
          name={name}
          error={fieldError?.message}
          onChange={onChange}
        />
      ),
    [props]
  );

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormSelect2;
