import { useState } from 'react';

import Input from './Input';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Input',
  component: Input,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { error: '', label: 'Input' }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    prefix: '$'
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('');

    const handleChange = (value: string) => {
      console.log(value);
      setValue(value);
    };

    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <Input {...args} size="md" value={value} onChange={handleChange}>
          <Input.Icon icon="fa-solid fa-check" />
        </Input>
        <Input {...args} size="sm" value={value} error="Nice">
          <Input.Icon icon="fa-solid fa-check" />
        </Input>
        <Input {...args} size="xs" value="sad" clearable>
          <Input.Icon icon="fa-solid fa-check" />
        </Input>
      </div>
    );
  }
};

export const Builder: Story = {
  args: {
    prefix: ''
  },
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Input {...args} size="md" className={{ input: 'w-[50px]' }} />
      <Input {...args} size="sm" className={{ input: 'w-[50px]' }} />
      <Input {...args} size="xs" className={{ input: 'w-[50px]' }} />
    </div>
  )
};
