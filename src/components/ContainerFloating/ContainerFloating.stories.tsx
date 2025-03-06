import Flex from '@components/Flex';

import ContainerFloating from './ContainerFloating';

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
    <div className="w-[400px] h-[400px] border border-gray-400">
      <Flex className="h-full" direction="column" justify="between">
        <Flex justify="between">
          <ContainerFloating {...args} placement="bottom-left" className="w-full">
            <ContainerFloating.Trigger>Test</ContainerFloating.Trigger>
            <ContainerFloating.Content>Content Test 2</ContainerFloating.Content>
          </ContainerFloating>
          <ContainerFloating {...args} placement="bottom-right" className="w-full">
            <ContainerFloating.Trigger>Test</ContainerFloating.Trigger>
            <ContainerFloating.Content>Content Test 2</ContainerFloating.Content>
          </ContainerFloating>
        </Flex>
        <Flex justify="between">
          <ContainerFloating {...args} placement="top-left" className="w-full">
            <ContainerFloating.Trigger>Test</ContainerFloating.Trigger>
            <ContainerFloating.Content>Content Test 2</ContainerFloating.Content>
          </ContainerFloating>
          <ContainerFloating {...args} placement="top-right" className="w-full">
            <ContainerFloating.Trigger>Test</ContainerFloating.Trigger>
            <ContainerFloating.Content>Content Test 2</ContainerFloating.Content>
          </ContainerFloating>
        </Flex>
      </Flex>
    </div>
  )
};
