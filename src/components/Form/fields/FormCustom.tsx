import { Controller, useFormContext } from 'react-hook-form';

import useValueMemo from '@hooks/useValueMemo';

import type { BaseFormFieldType } from '../Form';
import type { FieldValues, FieldPath, ControllerProps } from 'react-hook-form';

export type FormCustomProps<T extends FieldValues, TName extends FieldPath<T>> = {
  render: ControllerProps<T>['render'];
} & BaseFormFieldType<T, TName>;

const FormCustom = <T extends FieldValues, TName extends FieldPath<T>>(props: FormCustomProps<T, TName>) => {
  const { control } = useFormContext<T>();
  const renderMemo = useValueMemo(props.render, 'soft');

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormCustom;
