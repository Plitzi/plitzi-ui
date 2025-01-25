// Packages
import { useCallback, useMemo, useRef } from 'react';
import { z } from 'zod';

// Alias
import Button from '@components/Button';

// Relatives
import Form from './Form';
import useFormWatch from './hooks/useFormWatch';

// Types
import type { FormRefType } from './Form';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Form',
  component: Form,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const watchFormSchema = useMemo(
      () =>
        z.object({
          username: z.string().min(3, { message: 'Too Short' }).max(20, { message: 'Too Long' }),
          password: z.string().min(8, { message: 'Too Short' }).max(20, { message: 'Too Long' }),
          extra: z.string().optional()
        }),
      []
    );

    type Schema = typeof watchFormSchema;

    const formRef = useRef<FormRefType<Schema>>(null);

    const watchUsername = useFormWatch(formRef, 'username');
    const watchPassword = useFormWatch(formRef, 'password');
    const watchArray = useFormWatch(formRef, ['username', 'password']);

    console.log(watchUsername, watchPassword, watchArray);

    const handleSubmit = useCallback(async (values: z.infer<Schema>) => {
      return Promise.resolve(values);
    }, []);

    const initialValues = useMemo(() => ({ username: 'test', password: 'password' }), []);

    return (
      <Form {...args} initialValues={initialValues} schema={watchFormSchema} formRef={formRef} onSubmit={handleSubmit}>
        <Form.Input name="username" label="Username" />
        <Form.Input name="password" label="Password" />
        <Form.Input name="extra" label="Extra" />
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
};
