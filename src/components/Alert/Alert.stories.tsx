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
  args: { intent: 'success' }
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { closeable: true },
  render: args => {
    return (
      <div className="flex flex-col gap-4">
        <Alert {...args} size="xs">
          Alert Message
        </Alert>
        <Alert {...args} size="sm">
          Alert Message
        </Alert>
        <Alert {...args} size="md">
          Alert Message
        </Alert>
        <Alert {...args} size="xl">
          Alert Message
        </Alert>
        <Alert {...args} size="xs" solid={false}>
          Alert Message
        </Alert>
        <Alert {...args} size="sm" solid={false}>
          Alert Message
        </Alert>
        <Alert {...args} size="md" solid={false}>
          Alert Message
        </Alert>
        <Alert {...args} size="xl" solid={false}>
          Alert Message
        </Alert>
      </div>
    );
  }
};
