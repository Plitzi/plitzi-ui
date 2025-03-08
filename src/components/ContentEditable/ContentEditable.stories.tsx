import { useArgs } from '@storybook/preview-api';

import ContentEditable from './ContentEditable';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContentEditable',
  component: ContentEditable,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContentEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <ContentEditable
        {...args}
        className="bg-red-500 w-96 h-96"
        value={value}
        onChange={newValue => updateArgs({ value: newValue })}
      />
    );
  }
};
