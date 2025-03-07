import { useCallback } from 'react';

import Button from '@components/Button';
import Flex from '@components/Flex';

import MenuList from './MenuList';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MenuList',
  component: MenuList,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof MenuList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const handleSelect = useCallback((value?: string) => {
      console.log(value);
    }, []);

    return (
      <Flex direction="column" justify="between" className="w-[calc(100vw_-32px)] h-[calc(100vh_-_32px)] bg-gray-300">
        <Flex justify="between">
          <MenuList {...args} onSelect={handleSelect}>
            <MenuList.Trigger>
              <Button>Click Me</Button>
            </MenuList.Trigger>
            <MenuList.Menu>
              <MenuList.Item value="option1">Option 1</MenuList.Item>
              <MenuList.Item value="option2" disabled>
                Option 2
              </MenuList.Item>
              <MenuList.Item value="option3">
                Option 3
                <MenuList.Menu>
                  <MenuList.Item value="option31">Option 3.1</MenuList.Item>
                  <MenuList.Item value="option32" disabled>
                    Option 3.2
                  </MenuList.Item>
                  <MenuList.Item value="option33">Option 3.3</MenuList.Item>
                </MenuList.Menu>
              </MenuList.Item>
            </MenuList.Menu>
          </MenuList>
          <MenuList {...args} onSelect={handleSelect}>
            <MenuList.Trigger>
              <Button>Click Me</Button>
            </MenuList.Trigger>
            <MenuList.Menu>
              <MenuList.Item value="option1">Option 1</MenuList.Item>
              <MenuList.Item value="option2" disabled>
                Option 2
              </MenuList.Item>
              <MenuList.Item value="option3">
                Option 3
                <MenuList.Menu>
                  <MenuList.Item value="option31">Option 3.1</MenuList.Item>
                  <MenuList.Item value="option32" disabled>
                    Option 3.2
                  </MenuList.Item>
                  <MenuList.Item value="option33">Option 3.3</MenuList.Item>
                </MenuList.Menu>
              </MenuList.Item>
            </MenuList.Menu>
          </MenuList>
        </Flex>
        <Flex justify="between">
          <MenuList {...args} onSelect={handleSelect}>
            <MenuList.Trigger>
              <Button>Click Me</Button>
            </MenuList.Trigger>
            <MenuList.Menu>
              <MenuList.Item value="option1">Option 1</MenuList.Item>
              <MenuList.Item value="option2" disabled>
                Option 2
              </MenuList.Item>
              <MenuList.Item value="option3">
                Option 3
                <MenuList.Menu>
                  <MenuList.Item value="option31">Option 3.1</MenuList.Item>
                  <MenuList.Item value="option32" disabled>
                    Option 3.2
                  </MenuList.Item>
                  <MenuList.Item value="option33">Option 3.3</MenuList.Item>
                </MenuList.Menu>
              </MenuList.Item>
            </MenuList.Menu>
          </MenuList>
          <MenuList {...args} onSelect={handleSelect}>
            <MenuList.Trigger>
              <Button>Click Me</Button>
            </MenuList.Trigger>
            <MenuList.Menu>
              <MenuList.Item value="option1">Option 1</MenuList.Item>
              <MenuList.Item value="option2" disabled>
                Option 2
              </MenuList.Item>
              <MenuList.Item value="option3">
                Option 3
                <MenuList.Menu>
                  <MenuList.Item value="option31">Option 3.1</MenuList.Item>
                  <MenuList.Item value="option32" disabled>
                    Option 3.2
                  </MenuList.Item>
                  <MenuList.Item value="option33">Option 3.3</MenuList.Item>
                </MenuList.Menu>
              </MenuList.Item>
            </MenuList.Menu>
          </MenuList>
        </Flex>
      </Flex>
    );
  }
};
