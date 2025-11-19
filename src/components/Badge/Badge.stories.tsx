import Badge from './Badge';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Badge',
  component: Badge,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { intent: 'success' }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => {
    return (
      <div className="flex flex-col items-start gap-4">
        <Badge {...args} size="xs">
          Badge Message
        </Badge>
        <Badge {...args} size="sm">
          Badge Message
        </Badge>
        <Badge {...args} size="md">
          Badge Message
        </Badge>
        <Badge {...args} size="xl">
          Badge Message
        </Badge>
        <Badge {...args} size="xs" solid={false}>
          Badge Message
        </Badge>
        <Badge {...args} size="sm" solid={false}>
          Badge Message
        </Badge>
        <Badge {...args} size="md" solid={false}>
          Badge Message
        </Badge>
        <Badge {...args} size="xl" solid={false}>
          Badge Message
        </Badge>
      </div>
    );
  }
};
