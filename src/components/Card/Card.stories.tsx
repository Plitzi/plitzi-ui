// Relatives
import Card from './Card';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Card {...args} />
};
