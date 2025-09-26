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
  switch: z.boolean(),
  color: z.string(),
  files: z
    .custom<File | File[] | FileList>()
    .transform(val => {
      if (val instanceof File) {
        return [val];
      }

      if (val instanceof FileList) {
        return Array.from(val);
      }

      if (Array.isArray(val)) {
        return val;
      }

      return [];
    })
    .refine(arr => arr.length > 0, 'This field is required')
    .refine(files => files.find(f => f.size <= 0.1 * 1024 * 1024), 'Máx 5MB') // 5 * 1024 * 1024
    .refine(files => files.find(f => ['image/png', 'image/jpeg'].includes(f.type)), 'Solo PNG o JPG')
});

type Schema = typeof watchFormSchema;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const form = useForm({
      defaultValues: {
        username: 'test',
        password: 'password',
        extra: '',
        custom: 'hey',
        prop1: 'option-1',
        check: false,
        switch: false,
        color: '',
        files: undefined
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
              // form.formMethods.setValue('password', '');
            }}
          />
          <Form.Input name="password" label="Password" />
          <Form.Input name="extra" label="Extra" />
          <Form.Switch name="switch" label="Switch" />
          <Form.Checkbox name="check" label="Checkbox" />
          <Form.Color name="color" label="Color" />
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
          {/* <Form.FileUpload name="files" multiple clearable /> */}
          <Form.FileUpload name="files" multiple clearable canDragAndDrop label="Select a resource file to upload" />
        </Form.Body>
        <Form.Footer>
          <Button type="submit">Submit</Button>
        </Form.Footer>
      </Form>
    );
  }
};

const conditionalFormSchema = z.discriminatedUnion('category', [
  z.object({
    category: z.literal('option-1'),
    field1: z.string().min(2)
  }),
  z.object({
    provider: z.literal('option-2'),
    field2: z.string().min(2)
  })
]);

type SchemaConditional = typeof conditionalFormSchema;

export const DiscriminateUnion: Story = {
  args: {},
  render: function Render(args) {
    const form = useForm({
      defaultValues: {
        category: 'option-1',
        field1: '',
        field2: ''
      },
      config: { schema: conditionalFormSchema }
    });

    const [category, field1, field2] = useFormWatch(form.formMethods);
    console.log(category, field1, field2);

    const handleSubmit = useCallback(async (values: z.infer<SchemaConditional>) => {
      console.log('submitted', values);

      return Promise.resolve(values);
    }, []);

    return (
      <Form {...args} form={form} onSubmit={handleSubmit} className="gap-4">
        <Form.Body>
          <Form.Select name="category" label="Category">
            <option value="option-1">Option 1</option>
            <option value="option-2">Option 2</option>
          </Form.Select>
          {category === 'option-1' && <Form.Input name="field1" label="Field 1" />}
          {category === 'option-2' && <Form.Input name="field2" label="Field 2" />}
        </Form.Body>
        <Form.Footer>
          <Button type="submit">Submit</Button>
        </Form.Footer>
      </Form>
    );
  }
};
