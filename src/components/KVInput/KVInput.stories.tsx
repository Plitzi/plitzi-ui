import { useCallback, useState } from 'react';

import KVInput from './KVInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'KVInput',
  component: KVInput,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof KVInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Key-Value Input',
    error: 'Damn'
  },
  render: function Render(args) {
    const [value, setValue] = useState<[string, string][]>([]);

    const handleChange = useCallback((value: [string, string][]) => setValue(value), []);

    return <KVInput {...args} value={value} onChange={handleChange} />;
  }
};

export const CustomStyle: Story = {
  args: {
    label: 'Key-Value Input',
    size: 'xs'
  },
  render: function Render(args) {
    const [value, setValue] = useState<[string, string][]>([]);

    const handleChange = useCallback((value: [string, string][]) => setValue(value), []);

    return (
      <KVInput
        {...args}
        value={value}
        className={{ input: 'bg-red-300', inputContainer: 'px-0 py-0', item: 'w-full bg-blue-500' }}
        onChange={handleChange}
      />
    );
  }
};
