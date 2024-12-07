// Packages
import { useArgs } from '@storybook/preview-api';

// Relatives
import Sidebar from './Sidebar';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Sidebar',
  component: Sidebar,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="flex bg-gray-400 border border-solid border-gray-400">
        <Sidebar {...args} value={value} onChange={newValue => updateArgs({ value: newValue })}>
          <Sidebar.Icon icon="fa-solid fa-plus" />
          <Sidebar.Icon icon="fas fa-file" />
          <Sidebar.Icon icon="fa-solid fa-image" />
          <Sidebar.Icon icon="fa-solid fa-plus" />
          <Sidebar.Separator />
          <Sidebar.Icon icon="fa-solid fa-plus" />
        </Sidebar>
      </div>
    );
  }
};
