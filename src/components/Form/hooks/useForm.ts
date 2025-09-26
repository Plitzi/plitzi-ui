// import { zodResolver } from '@hookform/resolvers/zod'; // waiting from the next version of hookform/resolvers
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm as useReactHookForm } from 'react-hook-form';

import useValueMemo from '@hooks/useValueMemo';

import type {
  FieldErrors,
  UseFormProps as UseReactHookFormProps,
  UseFormReturn as UseFormReturnReactHookForm,
  DefaultValues
} from 'react-hook-form';
import type { z } from 'zod';

// Helpers
export type ZodFormSchema = z.ZodObject<z.ZodRawShape> | z.ZodDiscriminatedUnion<z.ZodObject<z.ZodRawShape>[]>;

export type UseFormProps<T extends ZodFormSchema> = Omit<
  UseReactHookFormProps<T>,
  'errors' | 'values' | 'formControl' | 'defaultValues'
> & {
  defaultValues?: DefaultValues<z.infer<T>>;
  errors?: FieldErrors<z.infer<T>>;
  config: { schema: T };
};

export type UseFormReturn<T extends ZodFormSchema> = {
  formMethods: UseFormReturnReactHookForm<z.infer<T>>;
  config: { schema: T };
};

const useForm = <T extends ZodFormSchema>({
  defaultValues: defaultValuesProp,
  config: configProp,
  errors,
  ...props
}: UseFormProps<T>): UseFormReturn<T> => {
  const defaultValues = useValueMemo(defaultValuesProp);
  const config = useValueMemo(configProp, 'hard', { skipFunctions: true });

  const methods = useReactHookForm<z.infer<T>>({
    ...props,
    defaultValues,
    context: undefined,
    errors,
    resolver: standardSchemaResolver(config.schema)
  });

  return { formMethods: methods, config };
};

export default useForm;
