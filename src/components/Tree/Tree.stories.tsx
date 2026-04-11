import { useCallback, useMemo, useState } from 'react';

import Tree from './Tree';

import type { TreeChangeState } from './Tree';
import type { ItemControlsProps } from './TreeNode';
import type { Meta, StoryObj } from '@storybook/react';
import type { ClipboardEvent } from 'react';

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
  render: function Render(argsProp) {
    const [args, setArgs] = useState(argsProp);

    const handleChange = useCallback((state: TreeChangeState) => {
      console.log(state);
      switch (state.action) {
        case 'itemsChange':
          setArgs(s => ({ ...s, items: state.data }));
          break;

        case 'itemsOpened':
          setArgs(s => ({ ...s, itemsOpened: state.data }));
          break;

        case 'itemChanged':
          setArgs(s => ({ ...s, items: state.data.items }));
          break;

        case 'itemDragged':
          setArgs(s => ({ ...s, items: state.data.items }));
          break;

        case 'itemHovered':
          setArgs(s => ({ ...s, itemHovered: state.data }));
          break;

        case 'itemSelected':
          setArgs(s => ({ ...s, itemSelected: state.data }));
          break;

        default:
      }
    }, []);

    const handleCopy = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
      console.log(e, (e.target as HTMLElement).closest('.tree'), (e.target as HTMLElement).closest('.tree-item'));
    }, []);

    const controls = useMemo(() => <W />, []);

    return <Tree {...args} itemControls={controls} onChange={handleChange} onCopy={handleCopy} />;
  }
};
