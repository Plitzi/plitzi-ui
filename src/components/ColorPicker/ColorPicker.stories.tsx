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
  render: args => (
    <div className="flex flex-col gap-2">
      <ColorPicker {...args} />
      <ColorPicker {...args} size="sm" />
      <ColorPicker {...args} size="xs" />
    </div>
  )
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
