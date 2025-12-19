import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { BaseFormFieldType } from '../Form';
import type { ReactNode } from 'react';
import type { FieldValues, FieldPath, FieldPathValue } from 'react-hook-form';

export type FormConditionalProps<T extends FieldValues, TName extends FieldPath<T>> = {
  when: TName;
  is: FieldPathValue<T, TName> | ((value: FieldPathValue<T, TName>) => boolean);
  children: ReactNode;
} & Omit<BaseFormFieldType<T, TName>, 'name'>;

const FormConditional = <T extends FieldValues, TName extends FieldPath<T>>({
  control: controlProp,
  when,
  is,
  children
}: FormConditionalProps<T, TName>) => {
  const { control } = useFormContext<T>();
  const value = useWatch({ control: controlProp ? controlProp : control, name: when });

  const shouldRender = useMemo(() => {
    if (typeof is === 'function') {
      return (is as (value: FieldPathValue<T, TName>) => boolean)(value);
    }

    return value === is;
  }, [value, is]);

  return shouldRender ? children : undefined;
};

export default FormConditional;
