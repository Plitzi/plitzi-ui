import ContainerCollapsable from './ContainerCollapsable';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerCollapsable',
  component: ContainerCollapsable,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerCollapsable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <ContainerCollapsable {...args} className="bg-gray-300">
      <ContainerCollapsable.Header title="Test">Custom</ContainerCollapsable.Header>
      <ContainerCollapsable.Content className="bg-gray-500">Content</ContainerCollapsable.Content>
    </ContainerCollapsable>
  )
};

export const Secondary: Story = {
  args: {},
  render: args => (
    <ContainerCollapsable {...args} className="bg-gray-300">
      <ContainerCollapsable.Header placement="right" title="Test">
        Custom
      </ContainerCollapsable.Header>
      <ContainerCollapsable.Content className="bg-gray-500">Content</ContainerCollapsable.Content>
    </ContainerCollapsable>
  )
};
