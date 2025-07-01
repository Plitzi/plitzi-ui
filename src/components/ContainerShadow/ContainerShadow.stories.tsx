import ContainerShadow from './ContainerShadow';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerShadow',
  component: ContainerShadow,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerShadow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <ContainerShadow
      {...args}
      fallback={
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
          <i className="fa-solid fa-sync fa-spin fa-3x" />
        </div>
      }
    >
      {/* <ContainerShadow.Link href="http://localhost:3034/plitzi-plugin-template.css" /> */}
      <ContainerShadow.Content>
        <div className="flex flex-col">
          <div className="bg-[#1A2835]">
            <h1 className="text-white">OPTIONS</h1>
          </div>
        </div>
      </ContainerShadow.Content>
    </ContainerShadow>
  )
};
