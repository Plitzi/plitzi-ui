import Checkbox from './Checkbox';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { disabled: false }
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col gap-4">
      <Checkbox {...args} label="Checkbox Label" size="md" />
      <Checkbox {...args} label="Checkbox Label" size="sm" />
      <Checkbox {...args} label="Checkbox Label" size="xs" />
    </div>
  )
};
