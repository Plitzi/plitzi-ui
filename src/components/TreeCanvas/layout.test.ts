import { describe, expect, it } from 'vitest';

import { isWithin, layoutTree } from './layout';

import type { TreeCanvasItem } from './layout';

const options = { nodeWidth: 100, nodeHeight: 50, gapX: 20, gapY: 30, gapStack: 10, columnSize: 2 };

const leaf = (id: string): TreeCanvasItem<null> => ({ id, data: null });

const at = (layout: ReturnType<typeof layoutTree<null>>, id: string) => layout.nodes.find(node => node.item.id === id);

describe('layoutTree', () => {
  it('stacks leaves in columns under their parent, a new column every `columnSize` of them', () => {
    const layout = layoutTree(
      [{ id: 'folder', data: null, container: true, children: [leaf('a'), leaf('b'), leaf('c')] }],
      options
    );

    // Two columns of 132 (an indent of 32 and a node of 100) and a gap: the folder is centred over both.
    expect(layout.width).toBe(284);
    expect(at(layout, 'folder')).toMatchObject({ x: 92, y: 0, depth: 0 });
    expect(at(layout, 'a')).toMatchObject({ x: 32, y: 80, depth: 1, parentId: 'folder' });
    expect(at(layout, 'b')).toMatchObject({ x: 32, y: 140 });
    expect(at(layout, 'c')).toMatchObject({ x: 184, y: 80 });
    expect(layout.height).toBe(190);
  });

  it('puts the top-level leaves in a column, and the items holding others side by side after it', () => {
    const layout = layoutTree(
      [leaf('page'), { id: 'folder', data: null, container: true, children: [leaf('inside')] }],
      options
    );

    expect(at(layout, 'page')).toMatchObject({ x: 32, y: 0, parentId: null });
    expect(at(layout, 'folder')).toMatchObject({ x: 168, y: 0 });
    expect(at(layout, 'inside')).toMatchObject({ x: 184, y: 80 });
  });

  it('draws an edge to every child: a step to a branch, a trunk into a leaf', () => {
    const layout = layoutTree(
      [{ id: 'p', data: null, children: [leaf('l'), { id: 'b', data: null, children: [leaf('x')] }] }],
      options
    );
    const toLeaf = layout.edges.find(edge => edge.to === 'l');
    const toBranch = layout.edges.find(edge => edge.to === 'b');

    expect(layout.edges).toHaveLength(3);
    expect(toLeaf?.path).toMatch(/H 32$/);
    expect(toBranch?.path).toMatch(/^M \d+ 50 V/);
  });

  it('keeps a folded branch in its place and draws nothing under it', () => {
    const layout = layoutTree([{ id: 'p', data: null, children: [leaf('a'), leaf('b')] }, leaf('c')], {
      ...options,
      collapsed: new Set(['p'])
    });

    expect(layout.nodes.map(node => node.item.id)).toEqual(['c', 'p']);
    expect(at(layout, 'p')).toMatchObject({ childCount: 2, collapsed: true, y: 0 });
    expect(layout.edges).toEqual([]);
  });

  it('answers nothing for nothing', () => {
    expect(layoutTree([], options)).toEqual({ nodes: [], edges: [], width: 0, height: 0 });
  });
});

describe('isWithin', () => {
  const items: TreeCanvasItem<null>[] = [
    { id: 'a', data: null, children: [{ id: 'b', data: null, children: [leaf('c')] }] }
  ];

  it('knows an item and everything under it, and nothing else', () => {
    expect(isWithin(items, 'a', 'a')).toBe(true);
    expect(isWithin(items, 'a', 'c')).toBe(true);
    expect(isWithin(items, 'b', 'a')).toBe(false);
    expect(isWithin(items, 'missing', 'a')).toBe(false);
  });
});
