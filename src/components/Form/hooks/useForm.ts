import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';

import useValueMemo from '@hooks/useValueMemo';

import type {
  FieldErrors,
  UseFormProps as UseReactHookFormProps,
  UseFormReturn as UseFormReturnReactHookForm,
  DefaultValues,
  Resolver
} from 'react-hook-form';
import type { z } from 'zod';

// Helpers
export type ZodFormSchema =
  | z.ZodObject
  | z.ZodDiscriminatedUnion<z.ZodObject[]>
  | z.ZodDiscriminatedUnion<readonly z.ZodObject[]>;

export type UseFormProps<T extends ZodFormSchema> = Omit<
  UseReactHookFormProps<z.input<T>>,
  'errors' | 'values' | 'formControl' | 'defaultValues'
> & {
  defaultValues?: DefaultValues<z.input<T>>;
  errors?: FieldErrors<z.input<T>>;
  config: { schema: T };
};

export type UseFormReturn<T extends ZodFormSchema> = {
  formMethods: UseFormReturnReactHookForm<z.input<T>, unknown, z.output<T>>;
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
  const resolver = useMemo(() => zodResolver(config.schema), [config.schema]) as unknown as Resolver<
    z.input<T>,
    unknown,
    z.output<T>
  >;

  const formMethods = useReactHookForm<z.input<T>, unknown, z.output<T>>({
    ...(props as UseReactHookFormProps<z.input<T>, unknown, z.output<T>>),
    defaultValues,
    context: undefined,
    errors,
    resolver
  });

  return { formMethods, config };
};

export default useForm;
