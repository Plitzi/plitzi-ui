import { useState } from 'react';

import Button from '@components/Button';
import Flex from '@components/Flex';

import Accordion from './Accordion';

import type { Meta, StoryObj } from '@storybook/react';

const DESIGN_URL =
  'https://www.figma.com/design/dnzPs6fRhB7Cv1QRB0wcPn/%5BReact%5D-DroneShield-Component-Gallery?node-id=3454-1137&node-type=frame&t=MexMF6xOg9rmePQI-0';

const meta = {
  title: 'Accordion',
  component: Accordion,
  parameters: {
    design: {
      type: 'figma',
      url: DESIGN_URL
    }
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { multi: true }
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const CustomItem = () => (
  <Accordion.Item id="item-4" className="not-first:border-t not-first:border-solid not-first:border-gray-300">
    <Accordion.Item.Header title="Item 5" isWarning>
      <div className="border border-white px-2 py-1">Header Slot</div>
    </Accordion.Item.Header>
    <Accordion.Item.Content>
      <Flex direction="column">Hello World 5</Flex>
    </Accordion.Item.Content>
  </Accordion.Item>
);

export const Primary: Story = {
  render: args => (
    <div className="flex flex-col h-100 bg-gray-600 text-white">
      <Accordion {...args} grow gap={0} defaultValue={['item-0', 'item-1']}>
        <Accordion.Item id="item-0" grow className="" minSize={150}>
          <Accordion.Item.Header title="Item 1">
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex>
              Hello World
              <div className="h-25.5 w-37.5 bg-red-500"></div>
            </Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <Accordion.Item id="item-1" className="border-t border-solid border-gray-300">
          <Accordion.Item.Header title="Item 2" isError>
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex className="h-37.5" direction="column">
              Hello World 2
            </Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <Accordion.Item id="item-2" className="not-first:border-t not-first:border-solid not-first:border-gray-300">
          <Accordion.Item.Header title="Item 3" isWarning>
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex direction="column">Hello World 3</Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <Accordion.Item id="item-3" className="not-first:border-t not-first:border-solid not-first:border-gray-300">
          <Accordion.Item.Header title="Item 4" isWarning>
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex direction="column">Hello World 4</Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <CustomItem />
      </Accordion>
    </div>
  )
};

export const NoSeparation: Story = {
  render: args => (
    <Accordion {...args} gap={0} className="flex flex-col h-100 bg-gray-600 text-white">
      <Accordion.Item id="item-0" className="border-t border-solid border-white">
        <Accordion.Item.Header title="Item 1">
          <div className="border border-white px-2 py-1">Header Slot</div>
        </Accordion.Item.Header>
        <Accordion.Item.Content>
          <Flex direction="column">Hello World</Flex>
        </Accordion.Item.Content>
      </Accordion.Item>
      <Accordion.Item id="item-1" className="border-t border-solid border-white">
        <Accordion.Item.Header title="Item 2" isError>
          <div className="border border-white px-2 py-1">Header Slot</div>
        </Accordion.Item.Header>
        <Accordion.Item.Content>
          <Flex direction="column">Hello World 2</Flex>
        </Accordion.Item.Content>
      </Accordion.Item>
      <Accordion.Item id="item-2" className="border-t border-solid border-white">
        <Accordion.Item.Header title="Item 2" isWarning>
          <div className="border border-white px-2 py-1">Header Slot</div>
        </Accordion.Item.Header>
        <Accordion.Item.Content>
          <Flex direction="column">Hello World 3</Flex>
        </Accordion.Item.Content>
      </Accordion.Item>
    </Accordion>
  )
};

export const ConditionalItems: Story = {
  render: function Render(args) {
    const [visible, setVisible] = useState(false);

    return (
      <Flex gap={8} direction="column" className="flex flex-col bg-gray-600 text-white">
        <Flex gap={2}>
          <Button disabled={visible} onClick={() => setVisible(true)} testId="btn-1">
            Show 2 and 4
          </Button>
          <Button disabled={!visible} onClick={() => setVisible(false)} testId="btn-2">
            Hide 2 and 4
          </Button>
        </Flex>
        <Accordion
          {...args}
          className="h-120"
          multi
          defaultValue={['item-0', 'item-1']}
          testId="testAccordion"
          alwaysOpen={false}
        >
          <Accordion.Item id="item-0" className="border-t border-solid border-white">
            <Accordion.Item.Header title="Item 1">
              <div className="border border-white px-2 py-1">Header Slot</div>
            </Accordion.Item.Header>
            <Accordion.Item.Content>
              <Flex direction="column">Hello World</Flex>
            </Accordion.Item.Content>
          </Accordion.Item>
          {visible && (
            <Accordion.Item id="item-1" className="border-t border-solid border-white">
              <Accordion.Item.Header title="Item 2" isError>
                <div className="border border-white px-2 py-1">Header Slot</div>
              </Accordion.Item.Header>
              <Accordion.Item.Content>
                <Flex direction="column">Hello World 2</Flex>
              </Accordion.Item.Content>
            </Accordion.Item>
          )}
          <Accordion.Item id="item-2" className="border-t border-solid border-white">
            <Accordion.Item.Header title="Item 3" isWarning>
              <div className="border border-white px-2 py-1">Header Slot</div>
            </Accordion.Item.Header>
            <Accordion.Item.Content>
              <Flex direction="column">Hello World 3</Flex>
            </Accordion.Item.Content>
          </Accordion.Item>
          {visible && (
            <Accordion.Item id="item-3" className="border-t border-solid border-white">
              <Accordion.Item.Header title="Item 4" isWarning>
                <div className="border border-white px-2 py-1">Header Slot</div>
              </Accordion.Item.Header>
              <Accordion.Item.Content>
                <Flex direction="column">Hello World 4</Flex>
              </Accordion.Item.Content>
            </Accordion.Item>
          )}
          <Accordion.Item id="item-4" className="border-t border-solid border-white">
            <Accordion.Item.Header title="Item 5" isWarning>
              <div className="border border-white px-2 py-1">Header Slot</div>
            </Accordion.Item.Header>
            <Accordion.Item.Content>
              <Flex direction="column">Hello World 5</Flex>
            </Accordion.Item.Content>
          </Accordion.Item>
        </Accordion>
      </Flex>
    );
  }
};
