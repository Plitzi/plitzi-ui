import ContainerResizable from './ContainerResizable';

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

export const North: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col gap-4 h-[500px]">
      <div className="grow">Content Outside</div>
      <ContainerResizable
        className="w-full"
        minConstraintsY={200}
        maxConstraintsY={500}
        height={200}
        resizeHandles={['n']}
        autoGrow={false}
        {...args}
      >
        <div>Content Inside</div>
      </ContainerResizable>
    </div>
  )
};
