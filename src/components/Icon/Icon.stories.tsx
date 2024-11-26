// Relatives
import Flex from '@components/Flex';
import Icon from './Icon';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { icon: 'fa-solid fa-rocket' },
  render: args => (
    <Flex items="center" gap={2}>
      <Icon {...args} size="xs" />
      <Icon {...args} size="sm" />
      <Icon {...args} size="base" />
      <Icon {...args} size="xl" />
    </Flex>
  )
};

export const AsChildren: Story = {
  args: {},
  render: args => <Icon {...args} />
};
