import { useArgs } from '@storybook/preview-api';
import { useCallback, useMemo } from 'react';

import Tree from './Tree';

import type { TreeChangeState } from './Tree';
import type { ItemControlsProps } from './TreeNode';
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

const W = ({ hovered, selected }: ItemControlsProps) => {
  if (!hovered && !selected) {
    return undefined;
  }

  return <div>Sad</div>;
};

export const Primary: Story = {
  args: {
    // size: 'sm',
    intent: 'secondary',
    itemSelected: '672a9fb8d8a5a53321f3f52c',
    items: [
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        icon: 'fa-solid fa-square',
        items: [
          {
            id: '672a10680e69f90f255f81ed',
            label: 'Heading 1',
            icon: 'https://cdn.plitzi.com/resources/img/favicon.svg'
          },
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
      (state: TreeChangeState) => {
        console.log(state);
        switch (state.action) {
          case 'itemsChange':
            updateArgs({ items: state.data });
            break;

          case 'itemsOpened':
            updateArgs({ itemsOpened: state.data });
            break;

          case 'itemChanged':
            updateArgs({ items: state.data.items });
            break;

          case 'itemDragged':
            updateArgs({
              items: state.data.items
            });
            break;

          case 'itemHovered':
            updateArgs({ itemHovered: state.data });
            break;

          case 'itemSelected':
            updateArgs({ itemSelected: state.data });
            break;

          default:
        }
      },
      [updateArgs]
    );

    const controls = useMemo(() => <W />, []);

    return (
      <Tree
        {...args}
        items={items}
        itemsOpened={itemsOpened}
        itemSelected={itemSelected}
        itemHovered={itemHovered}
        // controlsComponent={Tree.Controls}
        itemControls={controls}
        onChange={handleChange}
      />
    );
  }
};
