// Relatives
import Checkbox from './Checkbox';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Checkbox {...args} />
};
