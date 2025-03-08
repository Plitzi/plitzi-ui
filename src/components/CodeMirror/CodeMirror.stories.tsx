import CodeMirror from './CodeMirror';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'CodeMirror',
  component: CodeMirror,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof CodeMirror>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    theme: 'dark',
    autoComplete: [
      '--rawVariable1',
      { type: 'css-token', value: 'fancyVariable' },
      { type: 'token', value: 'normalToken' },
      { type: 'custom-token', value: 'customToken' }
    ]
  },
  render: args => <CodeMirror {...args} />
};
