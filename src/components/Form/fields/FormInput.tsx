// Packages
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// Alias
import Input from '@components/Input';

// Types
import type { BaseFormType } from '../Form';
import type { InputProps } from '@components/Input';
import type { FieldValues, ControllerProps } from 'react-hook-form';

export type FormInputProps<T extends FieldValues> = InputProps & BaseFormType<T> & { label: string };

const FormInput = <T extends FieldValues>(props: FormInputProps<T>) => {
  const { control } = useFormContext<T>();

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      ({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
        <Input {...props} ref={ref} size="md" value={value} name={name} error={fieldError?.message} onChange={onChange}>
          {props.children}
        </Input>
      ),
    [props]
  );

  return <Controller control={control} name={props.name} render={renderMemo} />;
};

export default FormInput;
