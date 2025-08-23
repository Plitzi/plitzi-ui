import Breadcrumb from './Breadcrumb';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Breadcrumb',
  component: Breadcrumb,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: ['Homepage', 'One', 'Last']
  },
  render: args => <Breadcrumb {...args} />
};
