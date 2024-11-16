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
  args: {}
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Input {...args} size="base" />
      <Input {...args} size="sm" />
      <Input {...args} size="xs" />
    </div>
  )
};
