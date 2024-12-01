// Relatives
import ContainerResizable from './ContainerResizable';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerResizable',
  component: ContainerResizable,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerResizable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <div className="flex gap-4 h-[300px]">
      <ContainerResizable
        className="h-full"
        minConstraintsX={300}
        maxConstraintsX={700}
        width={300}
        resizeHandles={['e']}
        autoGrow={false}
        {...args}
      >
        <div>Content Inside</div>
      </ContainerResizable>
      <div className="grow">Content Outside</div>
    </div>
  )
};
