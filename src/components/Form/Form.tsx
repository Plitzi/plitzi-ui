import { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';

import useTheme from '@hooks/useTheme';

import * as Inputs from './fields';

import type FormStyles from './Form.styles';
import type { variantKeys } from './Form.styles';
import type { UseFormReturn } from './hooks/useForm';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { FormEvent, ReactNode, RefObject } from 'react';
import type { FieldPath, FieldValues, SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

export type SupportedFormType<T extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>> = T | z.ZodEffects<T>;

export type FormConfig<T extends z.ZodObject<z.ZodRawShape>> = {
  schema: SupportedFormType<T>;
};

export type BaseFormType<T extends FieldValues> = { name: FieldPath<T> };

export type FormProps<T extends z.ZodObject<z.ZodRawShape>> = {
  testId?: string;
  form: UseFormReturn<T>;
  onSubmit?: SubmitHandler<z.infer<T>>;
  children?: ReactNode;
  ref?: RefObject<HTMLFormElement>;
} & useThemeSharedProps<typeof FormStyles, typeof variantKeys>;

const BaseForm = <T extends z.ZodObject<z.ZodRawShape>>({
  ref,
  children,
  form,
  className,
  testId,
  onSubmit
}: FormProps<T>) => {
  className = useTheme<typeof FormStyles, typeof variantKeys>('Form', { className, componentKey: 'root' });
  if (!(form as UseFormReturn<T> | undefined)) {
    throw new Error('form instance is required from useForm');
  }

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (onSubmit) {
        void form.formMethods.handleSubmit(onSubmit)(e);
      }
    },
    [form, onSubmit]
  );

  return (
    <FormProvider {...form.formMethods}>
      <form data-testid={testId} ref={ref} className={className} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};

const Form = Object.assign(BaseForm, Inputs);

export default Form;
