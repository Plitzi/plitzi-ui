import { useCallback } from 'react';
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
  custom: z.string().min(1),
  prop1: z.enum(['option-1', 'option-2', 'option-3']),
  check: z.boolean(),
  switch: z.boolean()
});

type Schema = typeof watchFormSchema;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const form = useForm({
      initialValues: {
        username: 'test',
        password: 'password',
        extra: '',
        custom: 'hey',
        prop1: 'option-1',
        check: false,
        switch: false
      },
      config: { schema: watchFormSchema }
    });

    const watchEverything = useFormWatch(form.formMethods);
    const watchUsername = useFormWatch(form.formMethods, 'username');
    const watchPassword = useFormWatch(form.formMethods, 'password');
    const [username, password] = useFormWatch(form.formMethods, ['username', 'password']);
    console.log(watchUsername, watchPassword, [username, password], watchEverything);

    const handleSubmit = useCallback(async (values: z.infer<Schema>) => {
      console.log('submitted', values);

      return Promise.resolve(values);
    }, []);

    return (
      <Form {...args} form={form} onSubmit={handleSubmit} className="gap-4">
        <Form.Body>
          <Form.Input
            name="username"
            label="Username"
            onChange={currentUsername => {
              console.log('called', currentUsername);
              form.formMethods.setValue('password', '');
            }}
          />
          <Form.Input name="password" label="Password" />
          <Form.Input name="extra" label="Extra" />
          <Form.Switch name="switch" label="Switch" value="test" />
          <Form.Checkbox name="check" label="Checkbox" value="test2" />
          <Controller
            name="custom"
            control={form.formMethods.control}
            render={({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
              <>
                <label htmlFor="form-custom-1">Custom RHF</label>
                <input ref={ref} id="form-custom-1" value={value} name={name} onChange={onChange} />
                {fieldError?.message && <ErrorMessage message={fieldError.message} error={!!fieldError.message} />}
              </>
            )}
          />
          <Form.Custom
            control={form.formMethods.control}
            name="custom"
            render={({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) => (
              <>
                <label htmlFor="form-custom-2">Custom Plitzi</label>
                <input ref={ref} id="form-custom-2" value={value} name={name} onChange={onChange} />
                {fieldError?.message && <ErrorMessage message={fieldError.message} error={!!fieldError.message} />}
              </>
            )}
          />
          <Form.Select2
            name="prop1"
            placeholder="None"
            label="Prop 1"
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' }
            ]}
          />
        </Form.Body>
        <Form.Footer>
          <Button type="submit">Submit</Button>
        </Form.Footer>
      </Form>
    );
  }
};
