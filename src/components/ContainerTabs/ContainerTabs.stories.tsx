import ContainerTabs from './ContainerTabs';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerTabs',
  component: ContainerTabs,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }];
    return (
      <div className="flex flex-col gap-4">
        <ContainerTabs {...args}>
          <ContainerTabs.Tabs items={tabs} />
          <ContainerTabs.TabContent>Tab Content 1</ContainerTabs.TabContent>
          <ContainerTabs.TabContent>Tab Content 2</ContainerTabs.TabContent>
        </ContainerTabs>
        <ContainerTabs {...args} size="sm">
          <ContainerTabs.Tabs items={tabs} />
          <ContainerTabs.TabContent>Tab Content 1</ContainerTabs.TabContent>
          <ContainerTabs.TabContent>Tab Content 2</ContainerTabs.TabContent>
        </ContainerTabs>
        <ContainerTabs {...args} size="xs">
          <ContainerTabs.Tabs items={tabs} />
          <ContainerTabs.TabContent>Tab Content 1</ContainerTabs.TabContent>
          <ContainerTabs.TabContent>Tab Content 2</ContainerTabs.TabContent>
        </ContainerTabs>
      </div>
    );
  }
};
