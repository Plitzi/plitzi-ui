// Packages
import { useState } from 'react';

// Relatives
import ContainerFloating from './ContainerFloating';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerFloating',
  component: ContainerFloating,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerFloating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <div className="w-40 h-40 border border-gray-300">
      <ContainerFloating {...args} className="w-full" backgroundDisabled closeOnClick={false}>
        <ContainerFloating.Content>Test</ContainerFloating.Content>
        <ContainerFloating.Container>Test 2</ContainerFloating.Container>
      </ContainerFloating>
    </div>
  )
};

export const Manual: Story = {
  args: {},
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-40 h-40 border border-gray-300">
        <button type="button" onClick={() => setOpen(state => !state)}>
          Click Me
        </button>
        <ContainerFloating
          {...args}
          className="w-full"
          backgroundDisabled
          disabled
          popupOpened={open}
          onContainerVisible={visible => setOpen(visible)}
        >
          <ContainerFloating.Content>Test</ContainerFloating.Content>
          <ContainerFloating.Container>Test 2</ContainerFloating.Container>
        </ContainerFloating>
      </div>
    );
  }
};
