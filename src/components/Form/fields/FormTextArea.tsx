// Packages
import { useMemo } from 'react';
import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

// Alias
import TextArea from '@components/TextArea';

// Types
import type { BaseFormType } from '../Form';
import type { TextAreaProps } from '@components/TextArea';
import type { FieldValues } from 'react-hook-form';

export type FormTextAreaProps<T extends FieldValues> = TextAreaProps & BaseFormType<T> & { label: string };

const FormTextArea = <T extends FieldValues>(props: FormTextAreaProps<T>) => {
  const { control } = useFormContext<T>();

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      ({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
        <TextArea
          {...props}
          ref={ref}
          size="md"
          value={value}
          name={name}
          error={fieldError?.message}
          onChange={onChange}
        >
          {props.children}
        </TextArea>
      ),
    [props]
  );

  return <Controller control={control} name={props.name} render={renderMemo} />;
};

export default FormTextArea;
