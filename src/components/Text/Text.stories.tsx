// Relatives
import Text from './Text';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Text',
  component: Text,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: { children: 'Hello World', weight: 500 }
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Text {...args} />
};
