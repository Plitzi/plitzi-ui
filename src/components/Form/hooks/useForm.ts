import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';

import useValueMemo from '@hooks/useValueMemo';

import type { FormConfig, SupportedFormType } from '../Form';
import type {
  DefaultValues,
  FieldErrors,
  UseFormProps as UseReactHookFormProps,
  UseFormReturn as UseFormReturnReactHookForm
} from 'react-hook-form';
import type { z } from 'zod';

export type AsyncDefaultValues<TFieldValues> = () => Promise<TFieldValues>;

export type InitialValues<T extends z.ZodObject<z.ZodRawShape>> =
  | DefaultValues<z.infer<T>>
  | AsyncDefaultValues<z.infer<T>>;

export type UseFormProps<T extends z.ZodObject<z.ZodRawShape>> = Omit<
  UseReactHookFormProps,
  'defaultValues' | 'errors' | 'values'
> & {
  initialValues?: InitialValues<T>;
  errors?: FieldErrors<z.infer<T>>;
  config: FormConfig<T>;
};

export type UseFormReturn<T extends z.ZodObject<z.ZodRawShape>> = {
  formMethods: UseFormReturnReactHookForm<z.TypeOf<SupportedFormType<T>>>;
  config: FormConfig<T>;
};

const useForm = <T extends z.ZodObject<z.ZodRawShape>>({
  initialValues: initialValuesProp,
  config: configProp,
  errors,
  ...props
}: UseFormProps<T>) => {
  const initialValues = useValueMemo(initialValuesProp);
  const config = useValueMemo(configProp, 'hard', { skipFunctions: true });

  const methods = useReactHookForm<z.infer<T>>({
    ...props,
    defaultValues: initialValues,
    context: undefined,
    errors,
    resolver: zodResolver(config.schema)
  });

  return { formMethods: methods, config };
};

export default useForm;
