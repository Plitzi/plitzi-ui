// Packages
import { useArgs } from '@storybook/preview-api';

// Relatives
import Switch from './Switch';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Switch',
  component: Switch,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="flex gap-4 flex-col">
        <Switch {...args} size="lg" checked={checked} onChange={e => updateArgs({ checked: e.target.checked })}>
          This is a label
        </Switch>
        <Switch {...args} checked={checked} onChange={e => updateArgs({ checked: e.target.checked })}>
          This is a label
        </Switch>
        <Switch {...args} size="sm" checked={checked} onChange={e => updateArgs({ checked: e.target.checked })}>
          This is a label
        </Switch>
        <Switch {...args} size="xs" checked={checked} onChange={e => updateArgs({ checked: e.target.checked })}>
          This is a label
        </Switch>
      </div>
    );
  }
};
