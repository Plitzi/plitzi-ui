import { useCallback, useState } from 'react';

import ColorPicker from './ColorPicker';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ColorPicker',
  component: ColorPicker,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const [value, setValue] = useState('#ff0000');

    const handleChange = useCallback((newValue: string) => {
      console.log('Selected Color:', newValue);
      setValue(newValue);
    }, []);

    return (
      <div className="flex flex-col gap-2">
        <ColorPicker {...args} value={value} onChange={handleChange} />
        <ColorPicker {...args} size="sm" value={value} onChange={handleChange} />
        <ColorPicker {...args} size="xs" value={value} onChange={handleChange} />
      </div>
    );
  }
};

export const Error: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col gap-2">
      <ColorPicker {...args} error="Hello World" />
      <ColorPicker {...args} size="sm" error="Hello World" />
      <ColorPicker {...args} size="xs" error="Hello World" />
    </div>
  )
};
