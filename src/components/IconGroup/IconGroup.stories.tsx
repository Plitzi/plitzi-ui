// Alias
import Flex from '@components/Flex';

// Relatives
import IconGroup from './IconGroup';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'IconGroup',
  component: IconGroup,
  tags: ['autodocs'],
  argTypes: {},
  args: { size: 'base' }
} satisfies Meta<typeof IconGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <Flex>
      <IconGroup {...args}>
        <IconGroup.Icon size="xs" icon="fa-solid fa-rocket" />
        <IconGroup.Icon size="sm" icon="fa-solid fa-rocket" />
        <IconGroup.Icon size="base" icon="fa-solid fa-rocket" />
        <IconGroup.Separator />
        <IconGroup.Icon size="xl" icon="fa-solid fa-rocket" />
        <IconGroup.Separator />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon icon="fa-solid fa-rocket" />
        <IconGroup.Icon>
          <img src="https://cdn.plitzi.com/resources/img/favicon.svg" className="w-6 h-6" alt="Plitzi" />
        </IconGroup.Icon>
      </IconGroup>
    </Flex>
  )
};
