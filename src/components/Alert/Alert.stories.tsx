// Relatives
import Alert from './Alert';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Alert',
  component: Alert,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Alert {...args}>Alert Message</Alert>
};
