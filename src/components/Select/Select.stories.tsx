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
  args: { label: 'Input' }
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { size: 'md', error: '' },
  render: args => (
    <div className="flex flex-col gap-4 items-center">
      <Select {...args}>
        <Select.Icon icon="fa-solid fa-check" />
        <option value="hello">Hello</option>
        <option value="world">World</option>
      </Select>
      <Select {...args} size="sm" error="Test">
        <Select.Icon icon="fa-solid fa-check" />
        <option value="hello">Hello</option>
        <option value="world">World</option>
      </Select>
      <Select {...args} value="hello" size="xs" clearable>
        <Select.Icon icon="fa-solid fa-check" />
        <option value="hello">Hello</option>
        <option value="world">World</option>
      </Select>
    </div>
  )
};
