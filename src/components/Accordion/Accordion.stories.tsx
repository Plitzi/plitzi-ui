// Packages
import { expect, within, userEvent, waitFor } from '@storybook/test';
import { useState } from 'react';

// Alias
import Button from '@components/Button';
import Flex from '@components/Flex';

// Relatives
import Accordion from './Accordion';

// Types
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
  args: {}
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: args => (
    <div className="flex flex-col h-[400px] bg-red-300">
      <Accordion {...args} grow>
        <Accordion.Item grow>
          <Accordion.Item.Header title="Item 1">
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex direction="column">Hello World</Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Item.Header title="Item 2" isError>
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex direction="column">Hello World 2</Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Item.Header title="Item 2" isWarning>
            <div className="border border-white px-2 py-1">Header Slot</div>
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <Flex direction="column">Hello World 3</Flex>
          </Accordion.Item.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )
};

export const NoSeparation: Story = {
  render: args => (
    <Accordion {...args} gap={0}>
      <Accordion.Item className="border-t border-solid border-gray-500">
        <Accordion.Item.Header title="Item 1">
          <div className="border border-white px-2 py-1">Header Slot</div>
        </Accordion.Item.Header>
        <Accordion.Item.Content>
          <Flex direction="column">Hello World</Flex>
        </Accordion.Item.Content>
      </Accordion.Item>
      <Accordion.Item className="border-t border-solid border-gray-500">
        <Accordion.Item.Header title="Item 2" isError>
          <div className="border border-white px-2 py-1">Header Slot</div>
        </Accordion.Item.Header>
        <Accordion.Item.Content>
          <Flex direction="column">Hello World 2</Flex>
        </Accordion.Item.Content>
      </Accordion.Item>
      <Accordion.Item className="border-t border-solid border-gray-500">
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
      <Flex gap={8} direction="column">
        <Flex gap={2}>
          <Button content="Show 2 and 4" disabled={visible} onClick={() => setVisible(true)} testId="btn-1" />
          <Button content="Hide 2 and 4" disabled={!visible} onClick={() => setVisible(false)} testId="btn-2" />
        </Flex>
        <Accordion {...args} multi defaultIndex={['fancy', '1']} testId="testAccordion">
          <Accordion.Item id="fancy">
            <Accordion.Item.Header title="Item 1">
              <div className="border border-white px-2 py-1">Header Slot</div>
            </Accordion.Item.Header>
            <Accordion.Item.Content>
              <Flex direction="column">Hello World</Flex>
            </Accordion.Item.Content>
          </Accordion.Item>
          {visible && (
            <Accordion.Item>
              <Accordion.Item.Header title="Item 2" isError>
                <div className="border border-white px-2 py-1">Header Slot</div>
              </Accordion.Item.Header>
              <Accordion.Item.Content>
                <Flex direction="column">Hello World 2</Flex>
              </Accordion.Item.Content>
            </Accordion.Item>
          )}
          <Accordion.Item>
            <Accordion.Item.Header title="Item 3" isWarning>
              <div className="border border-white px-2 py-1">Header Slot</div>
            </Accordion.Item.Header>
            <Accordion.Item.Content>
              <Flex direction="column">Hello World 3</Flex>
            </Accordion.Item.Content>
          </Accordion.Item>
          {visible && (
            <Accordion.Item>
              <Accordion.Item.Header title="Item 4" isWarning>
                <div className="border border-white px-2 py-1">Header Slot</div>
              </Accordion.Item.Header>
              <Accordion.Item.Content>
                <Flex direction="column">Hello World 4</Flex>
              </Accordion.Item.Content>
            </Accordion.Item>
          )}
          <Accordion.Item>
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
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const btn1 = canvas.getByTestId('btn-1-button');
    const btn2 = canvas.getByTestId('btn-2-button');

    await step('Click btn-2', async () => {
      const accordionItem = canvas.getByTestId('testAccordion-1-accordion-item');
      await userEvent.click(btn2);
      await waitFor(() => expect(accordionItem).not.toBeInTheDocument());
    });

    await step('Click btn-1', async () => {
      await userEvent.click(btn1);
      const accordionItem = canvas.getByTestId('testAccordion-1-accordion-item');
      await waitFor(() => expect(accordionItem).toBeInTheDocument());
    });
  }
};
