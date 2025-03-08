import Flex from './Flex';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { direction: 'column', gap: 2 },
  render: args => (
    <Flex {...args}>
      <span>Element 1</span>
      <span>Element 2</span>
    </Flex>
  )
};
