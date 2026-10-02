import { useCallback, useState } from 'react';

import TreeCanvas from './TreeCanvas';

import type { TreeCanvasItem } from './layout';
import type { Meta, StoryObj } from '@storybook/react';

type Entry = { title: string; folder?: boolean };

const initial: TreeCanvasItem<Entry>[] = [
  { id: 'home', data: { title: 'Home' } },
  {
    id: 'blog',
    data: { title: 'Blog', folder: true },
    container: true,
    children: [
      { id: 'post', data: { title: 'Post' } },
      { id: 'archive', data: { title: 'Archive', folder: true }, container: true, children: [] }
    ]
  },
  { id: 'about', data: { title: 'About' } }
];

/** Takes an item out of wherever it is and puts it under `parentId` — the top level when `null`. */
const moveItem = (items: TreeCanvasItem<Entry>[], id: string, parentId: string | null): TreeCanvasItem<Entry>[] => {
  let moved: TreeCanvasItem<Entry> | undefined;
  const without = (list: TreeCanvasItem<Entry>[]): TreeCanvasItem<Entry>[] =>
    list.flatMap(item => {
      if (item.id === id) {
        moved = item;

        return [];
      }

      return [{ ...item, children: item.children && without(item.children) }];
    });
  const rest = without(items);
  if (!moved) {
    return items;
  }

  const target = moved;
  if (parentId === null) {
    return [...rest, target];
  }

  const into = (list: TreeCanvasItem<Entry>[]): TreeCanvasItem<Entry>[] =>
    list.map(item =>
      item.id === parentId
        ? { ...item, children: [...(item.children ?? []), target] }
        : { ...item, children: item.children && into(item.children) }
    );

  return into(rest);
};

const meta = {
  title: 'TreeCanvas',
  component: TreeCanvas<Entry>,
  tags: ['autodocs'],
  args: {
    items: initial,
    renderNode: item => (
      <div className="flex h-full flex-col justify-center rounded-xl border border-gray-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="text-sm font-semibold">{item.data.title}</span>
        <span className="text-xs text-gray-500">{item.data.folder ? 'Folder' : 'Page'}</span>
      </div>
    ),
    nodeWidth: 180,
    nodeHeight: 72
  }
} satisfies Meta<typeof TreeCanvas<Entry>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: function Render(args) {
    const [items, setItems] = useState(args.items);
    const [selectedId, setSelectedId] = useState<string>();
    const [collapsedIds, setCollapsedIds] = useState<string[]>([]);

    const handleMove = useCallback(
      (id: string, parentId: string | null) => setItems(current => moveItem(current, id, parentId)),
      []
    );

    const handleToggle = useCallback(
      (id: string) =>
        setCollapsedIds(current => (current.includes(id) ? current.filter(item => item !== id) : [...current, id])),
      []
    );

    return (
      <TreeCanvas
        {...args}
        className="h-[480px]"
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onMove={handleMove}
        collapsedIds={collapsedIds}
        onToggleCollapsed={handleToggle}
      />
    );
  }
};
