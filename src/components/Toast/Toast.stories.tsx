import ToastProvider from './ToastProvider';
import useToast from './useToast';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ToastProvider',
  component: ToastProvider,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const TemplateInternal = () => {
  const { addToast } = useToast();

  const handleClick = () => {
    addToast(
      <div>
        <div>Hello World</div>
        <div>This is a toast message</div>
      </div>
    );
  };

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  );
};

export const Primary: Story = {
  args: {},
  render: args => (
    <ToastProvider {...args}>
      <TemplateInternal />
    </ToastProvider>
  )
};
