// Alias
import Flex from '@components/Flex';
import DesktopWithMobile from '@icons/DesktopWithMobile';

// Relatives
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
      <Icon {...args} size="lg" />
      <Icon {...args} size="xl" />
      <Icon {...args} size="2xl" />
      <Icon {...args} size="3xl" />
      <Icon {...args} size="4xl" />
      <Icon {...args} size="5xl" />
      <Icon {...args} size="6xl" />
      <Icon {...args} size="7xl" />
      <Icon {...args} size="8xl" />
      <Icon {...args} size="9xl" />
    </Flex>
  )
};

export const AsChildren: Story = {
  args: {},
  render: args => (
    <Icon {...args}>
      <img src="https://cdn.plitzi.com/resources/img/favicon.svg" className="w-6 h-6" alt="Plitzi" />
    </Icon>
  )
};

export const SvgIcon: Story = {
  args: {},
  render: args => (
    <Icon {...args}>
      <DesktopWithMobile />
    </Icon>
  )
};
