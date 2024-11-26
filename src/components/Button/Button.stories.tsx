// Relatives
import Button from './Button';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Button',
  component: Button,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { iconPlacement: 'both' }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Button {...args} size="base">
        <Button.Icon icon="fa-solid fa-check" />
      </Button>
      <Button {...args} size="sm" />
      <Button {...args} size="xs" />
    </div>
  )
};

export const Secondary: Story = {
  args: { intent: 'secondary' },
  render: args => <Button {...args} />
};
