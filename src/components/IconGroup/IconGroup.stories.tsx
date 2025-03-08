import Flex from '@components/Flex';

import IconGroup from './IconGroup';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'IconGroup',
  component: IconGroup,
  tags: ['autodocs'],
  argTypes: {},
  args: { size: 'md' }
} satisfies Meta<typeof IconGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <Flex wrap="wrap" gap={4} items="center">
      <IconGroup {...args}>
        <IconGroup.Icon size="xs" icon="fa-solid fa-rocket" />
        <IconGroup.Icon size="sm" icon="fa-solid fa-rocket" />
        <IconGroup.Icon size="md" icon="fa-solid fa-rocket" />
        <IconGroup.Separator />
        <IconGroup.Icon size="xl" icon="fa-solid fa-rocket" />
        <IconGroup.Separator />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon>
          <img src="https://cdn.plitzi.com/resources/img/favicon.svg" className="w-6 h-6" alt="Plitzi" />
        </IconGroup.Icon>
      </IconGroup>
      <IconGroup {...args} size="xs">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="sm">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="md">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="lg">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="2xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="3xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="5xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="6xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="7xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="8xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
      <IconGroup {...args} size="9xl">
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
      </IconGroup>
    </Flex>
  )
};
