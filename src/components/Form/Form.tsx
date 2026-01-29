import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';

import useTheme from '@hooks/useTheme';

import * as Inputs from './fields';
import FormBody from './FormBody';
import FormFooter from './FormFooter';
import FormHeader from './FormHeader';

import type FormStyles from './Form.styles';
import type { variantKeys } from './Form.styles';
import type { FormBodyProps } from './FormBody';
import type { FormFooterProps } from './FormFooter';
import type { FormHeaderProps } from './FormHeader';
import type { UseFormReturn, ZodFormSchema } from './hooks/useForm';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode, RefObject, SyntheticEvent } from 'react';
import type { Control, FieldPath, FieldValues, SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

export type BaseFormFieldType<T extends FieldValues, TName extends FieldPath<T>> = {
  control?: Control<T>;
  name: TName;
};

export type FormProps<T extends ZodFormSchema> = {
  testId?: string;
  form: UseFormReturn<T>;
  onReset?: (e: SyntheticEvent<HTMLFormElement>) => void;
  onSubmit?: SubmitHandler<z.infer<T>>;
  children?: ReactNode;
  ref?: RefObject<HTMLFormElement>;
} & useThemeSharedProps<typeof FormStyles, typeof variantKeys>;

const BaseForm = <T extends ZodFormSchema>({
  ref,
  children,
  form,
  className,
  scrollable,
  testId,
  onReset,
  onSubmit
}: FormProps<T>) => {
  className = useTheme<typeof FormStyles, typeof variantKeys>('Form', { className, componentKey: 'root' });

  const { header, body, footer } = useMemo(() => {
    const components: { header?: ReactNode; body?: ReactNode; footer?: ReactNode } = {
      header: undefined,
      body: undefined,
      footer: undefined
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === FormHeader) {
        components.header = cloneElement<FormHeaderProps>(child as ReactElement<FormHeaderProps>, {
          testId: testId ? `${testId}-header` : undefined,
          ...(child.props as FormHeaderProps)
        });
      } else if (child.type === FormBody) {
        components.body = cloneElement<FormBodyProps>(child as ReactElement<FormBodyProps>, {
          testId: testId ? `${testId}-body` : undefined,
          scrollable,
          ...(child.props as FormBodyProps)
        });
      } else if (child.type === FormFooter) {
        components.footer = cloneElement<FormFooterProps>(child as ReactElement<FormFooterProps>, {
          testId: testId ? `${testId}-footer` : undefined,
          ...(child.props as FormFooterProps)
        });
      }
    });

    return components;
  }, [children, scrollable, testId]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      if (onSubmit) {
        void form.formMethods.handleSubmit(onSubmit)(e);
      }
    },
    [form, onSubmit]
  );

  if (!(form as UseFormReturn<T> | undefined)) {
    throw new Error('form instance is required from useForm');
  }

  return (
    <FormProvider {...form.formMethods}>
      <form data-testid={testId} ref={ref} className={className} onReset={onReset} onSubmit={handleSubmit}>
        {header}
        {body}
        {footer}
      </form>
    </FormProvider>
  );
};

const Form = Object.assign(BaseForm, { ...Inputs, Header: FormHeader, Body: FormBody, Footer: FormFooter });

export default Form;
