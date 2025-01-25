// Packages
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import * as Inputs from './fields';

// Types
import type FormStyles from './Form.styles';
import type { variantKeys } from './Form.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { FormEvent, ReactNode, RefObject } from 'react';
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type z from 'zod';

export type FormRefType<T extends z.ZodObject<z.ZodRawShape>> = UseFormReturn<z.infer<T>>;
export type BaseFormType<T extends FieldValues> = { name: FieldPath<T> };

export type FormProps<T extends z.ZodObject<z.ZodRawShape>> = {
  initialValues?: DefaultValues<z.infer<T>>;
  errors?: FieldErrors<z.infer<T>>;
  onSubmit?: SubmitHandler<z.infer<T>>;
  children?: ReactNode;
  schema?: T;
  ref?: RefObject<HTMLFormElement>;
  formRef?: RefObject<UseFormReturn<z.infer<T>> | null>;
} & useThemeSharedProps<typeof FormStyles, typeof variantKeys>;

const BaseForm = <T extends z.ZodObject<z.ZodRawShape>>({
  children,
  className,
  initialValues,
  errors,
  schema,
  ref,
  formRef,
  onSubmit,
  ...props
}: FormProps<T>) => {
  className = useTheme<typeof FormStyles, typeof variantKeys>('Form', { className, componentKey: 'root' });
  const methods = useForm<z.infer<T>>({
    ...props,
    errors,
    defaultValues: initialValues,
    // context,
    resolver: schema ? zodResolver(schema) : undefined
  });

  if (formRef) {
    formRef.current = methods;
  }

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (onSubmit) {
        void methods.handleSubmit(onSubmit)(e);
      }
    },
    [methods, onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form ref={ref} className={className} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};

const Form = Object.assign(BaseForm, Inputs);

export default Form;
