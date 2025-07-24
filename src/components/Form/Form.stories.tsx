import { useCallback, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';

import Form from './Form';
import useForm from './hooks/useForm';
import useFormWatch from './hooks/useFormWatch';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Form',
  // component: Form,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs']
  // argTypes: {},
  // args: {}
} satisfies Meta<Omit<typeof Form, 'form'>>;

export default meta;

type Story = StoryObj<typeof meta>;

const watchFormSchema = z.object({
  username: z.string().min(3, { message: 'Too Short' }).max(20, { message: 'Too Long' }),
  password: z.string().min(8, { message: 'Too Short' }).max(20, { message: 'Too Long' }),
  extra: z.string().optional(),
  custom: z.string().min(1)
});

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const initialValues = useMemo(() => ({ username: 'test', password: 'password', extra: '', custom: 'hey' }), []);

    type Schema = typeof watchFormSchema;

    const form = useForm({ initialValues, config: { schema: watchFormSchema } });

    const watchUsername = useFormWatch(form.formMethods, 'username');
    const watchPassword = useFormWatch(form.formMethods, 'password');
    const watchArray = useFormWatch(form.formMethods, ['username', 'password']);
    console.log(watchUsername, watchPassword, watchArray);

    const handleSubmit = useCallback(async (values: z.infer<Schema>) => {
      console.log('submitted', values);

      return Promise.resolve(values);
    }, []);

    return (
      <Form {...args} form={form} onSubmit={handleSubmit}>
        <Form.Body>
          <Form.Input name="username" label="Username" />
          <Form.Input name="password" label="Password" />
          <Form.Input name="extra" label="Extra" />
          <Form.Input name="" />
          <Controller
            name="custom"
            control={form.formMethods.control}
            render={({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
              <>
                <label htmlFor="form-custom">Custom RHF</label>
                <input ref={ref} id="form-custom" value={value} name={name} onChange={onChange} />
                {fieldError?.message && <ErrorMessage message={fieldError.message} error={!!fieldError.message} />}
              </>
            )}
          />
          <Form.Custom
            control={form.formMethods.control}
            name="custom"
            render={({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
              <>
                <label htmlFor="form-custom">Custom Plitzi</label>
                <input ref={ref} id="form-custom" value={value} name={name} onChange={onChange} />
                {fieldError?.message && <ErrorMessage message={fieldError.message} error={!!fieldError.message} />}
              </>
            )}
          />
          <Button type="submit">Submit</Button>
        </Form.Body>
      </Form>
    );
  }
};
