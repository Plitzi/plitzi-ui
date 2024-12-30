// Packages
import { useState } from 'react';

// Relatives
import TextArea from './TextArea';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'TextArea',
  component: TextArea,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { error: '' }
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    error: 'Error Found'
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
        <TextArea {...args} size="md" value={value} onChange={handleChange} />
        <TextArea {...args} size="sm" value={value} />
        <TextArea {...args} size="xs" value={value} />
      </div>
    );
  }
};

export const Builder: Story = {
  args: {
    error: ''
  },
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <TextArea {...args} size="md" className={{ input: 'w-[50px]' }} />
      <TextArea {...args} size="sm" className={{ input: 'w-[50px]' }} />
      <TextArea {...args} size="xs" className={{ input: 'w-[50px]' }} />
    </div>
  )
};
