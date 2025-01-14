// Packages
import { useArgs } from '@storybook/preview-api';
import { useCallback } from 'react';

// Relatives
import Tree from './Tree';

// Types
import type { TreeChangeState, TreeItem } from './Tree';
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
    itemSelected: '672a9fb8d8a5a53321f3f52c',
    items: [
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        isParent: true,
        parentId: undefined,
        items: [
          {
            id: '672a10680e69f90f255f81ed',
            label: 'Heading 1',
            isParent: false,
            parentId: '657425e280b5b09c93b4a284'
          },
          {
            id: '672a9fb7d8a5a53321f3f52c',
            label: 'Heading 2',
            isParent: false,
            parentId: '657425e280b5b09c93b4a284'
          },
          {
            id: '678226237479ee7d61c55cc2',
            label: 'Container',
            isParent: true,
            parentId: '657425e280b5b09c93b4a284',
            items: [
              {
                id: '672a9fb8d8a5a53321f3f52c',
                label: 'Heading 3',
                isParent: false,
                parentId: '678226237479ee7d61c55cc2'
              }
            ]
          }
        ]
      },
      {
        id: '657425e280b5b09c93b4a285',
        label: 'Page',
        isParent: true,
        parentId: undefined,
        items: [
          {
            id: '672a10680e69f90f255f82ed',
            label: 'Heading 4',
            isParent: false,
            parentId: '657425e280b5b09c93b4a285'
          },
          {
            id: '672a9fb7d8a5a53325f3f52c',
            label: 'Heading 5',
            isParent: false,
            parentId: '657425e280b5b09c93b4a285'
          },
          {
            id: '678226237479ee7d71c55cc2',
            label: 'Container 2',
            isParent: false,
            parentId: '657425e280b5b09c93b4a285'
          }
        ]
      }
    ]
  },
  render: function Render(args) {
    const [{ items, itemsOpened, itemSelected, itemHovered }, updateArgs] = useArgs<typeof args>();

    const handleChange = useCallback(
      (action: TreeChangeState['action'], data: TreeChangeState['data']) => {
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
