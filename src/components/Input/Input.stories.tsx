// Packages
import { useState } from 'react';

// Relatives
import Input from './Input';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Input',
  component: Input,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { error: '' }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: 'fa-solid fa-check',
    hasError: true,
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
        <Input {...args} size="base" value={value} onChange={handleChange} />
        <Input {...args} size="sm" />
        <Input {...args} size="xs" />
      </div>
    );
  }
};

export const Builder: Story = {
  args: {
    icon: '',
    hasError: false,
    prefix: ''
  },
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Input {...args} size="base" className={{ input: 'w-[50px]' }} />
      <Input {...args} size="sm" className={{ input: 'w-[50px]' }} />
      <Input {...args} size="xs" className={{ input: 'w-[50px]' }} />
    </div>
  )
};
