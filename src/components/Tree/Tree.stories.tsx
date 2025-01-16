// Packages
import { useArgs } from '@storybook/preview-api';
import { useCallback } from 'react';

// Relatives
import Tree from './Tree';

// Types
import type { TreeChangeState, TreeItem } from './Tree';
import type { DropPosition } from './utils';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Tree',
  component: Tree,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    intent: 'secondary',
    itemSelected: '672a9fb8d8a5a53321f3f52c',
    items: [
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        icon: 'fa-solid fa-square',
        items: [
          { id: '672a10680e69f90f255f81ed', label: 'Heading 1' },
          { id: '672a9fb7d8a5a53321f3f52c', label: 'Heading 2' },
          {
            id: '678226237479ee7d61c55cc2',
            label: 'Container',
            items: [{ id: '672a9fb8d8a5a53321f3f52c', label: 'Heading 3' }]
          }
        ]
      },
      {
        id: '657425e280b5b09c93b4a285',
        label: 'Page',
        items: [
          { id: '672a10680e69f90f255f82ed', label: 'Heading 4' },
          { id: '672a9fb7d8a5a53325f3f52c', label: 'Heading 5' },
          { id: '678226237479ee7d71c55cc2', label: 'Container 2' }
        ]
      }
    ]
  },
  render: function Render(args) {
    const [{ items, itemsOpened, itemSelected, itemHovered }, updateArgs] = useArgs<typeof args>();

    const handleChange = useCallback(
      (action: TreeChangeState['action'], data: TreeChangeState['data']) => {
        console.log(action, data);
        switch (action) {
          case 'itemsChange':
            updateArgs({ items: data as TreeItem[] });
            break;

          case 'itemsOpened':
            updateArgs({ itemsOpened: data as { [key: string]: boolean } });
            break;

          case 'itemChanged':
            updateArgs({ items: data as TreeItem[] });
            break;

          case 'itemDragged':
            updateArgs({
              items: (data as { id: string; toId: string; dropPosition: DropPosition; items: TreeItem[] }).items
            });
            break;

          default:
        }
        updateArgs({});
      },
      [updateArgs]
    );

    const handleHover = useCallback((value?: string) => updateArgs({ itemHovered: value }), [updateArgs]);

    const handleSelect = useCallback((value?: string) => updateArgs({ itemSelected: value }), [updateArgs]);

    return (
      <Tree
        {...args}
        items={items}
        itemsOpened={itemsOpened}
        itemSelected={itemSelected}
        itemHovered={itemHovered}
        onChange={handleChange}
        onHover={handleHover}
        onSelect={handleSelect}
      />
    );
  }
};
