import Markdown from './Markdown';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Markdown',
  component: Markdown,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children:
      'test content\n# nice\n```html\n<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">\nHola Mundo\n</button>\n```\n- `bg-red-500`: Fondo rojo.\n- `hover:bg-red-700`: Fondo rojo más oscuro al pasar el cursor sobre el botón.\n\n| Variable | Value |\n|---|---|\n| `--color-primary` | `#7c3aed` |\n| `--color-surface` | `#ffffff` |\n| `--font-size-base` | `16px` |\n| `--spacing-md` | `16px` |\n| `--border-radius` | `8px` |'
  }
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Markdown {...args} />
};
