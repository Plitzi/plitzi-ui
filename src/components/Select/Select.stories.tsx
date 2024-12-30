// Relatives
import Select from './Select';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Select',
  component: Select,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { size: 'md', error: '' },
  render: args => (
    <Select {...args}>
      <Select.Icon icon="fa-solid fa-check" />
      <option value="hello">Hello</option>
      <option value="world">World</option>
    </Select>
  )
};
