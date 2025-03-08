import Dummy from './Dummy';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Dummy',
  component: Dummy,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { content: 'Content Here' }
} satisfies Meta<typeof Dummy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Dummy {...args} />
};
