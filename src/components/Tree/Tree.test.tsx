import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Tree from './Tree';
import { getFlatItems, moveNode } from './utils';

describe('Tree Tests', () => {
  it('Render Component', () => {
    render(<Tree items={[]} testId="tree" />);

    const treeInstance = screen.getByTestId('tree');
    expect(treeInstance).toBeDefined();
  });

  it('Utils valid moveNode', () => {
    const items = [
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
    ];
    const flatItems = getFlatItems(items);

    expect(moveNode('672a9fb8d8a5a53321f3f52c', '672a9fb7d8a5a53321f3f52c', 'top', items, flatItems)).toEqual([
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        icon: 'fa-solid fa-square',
        items: [
          { id: '672a10680e69f90f255f81ed', label: 'Heading 1' },
          { id: '672a9fb8d8a5a53321f3f52c', label: 'Heading 3' },
          { id: '672a9fb7d8a5a53321f3f52c', label: 'Heading 2' },
          { id: '678226237479ee7d61c55cc2', label: 'Container', items: [] }
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
    ]);

    expect(moveNode('672a9fb8d8a5a53321f3f52c', '672a9fb7d8a5a53321f3f52c', 'bottom', items, flatItems)).toEqual([
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        icon: 'fa-solid fa-square',
        items: [
          { id: '672a10680e69f90f255f81ed', label: 'Heading 1' },
          { id: '672a9fb7d8a5a53321f3f52c', label: 'Heading 2' },
          { id: '672a9fb8d8a5a53321f3f52c', label: 'Heading 3' },
          { id: '678226237479ee7d61c55cc2', label: 'Container', items: [] }
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
    ]);

    expect(moveNode('672a9fb8d8a5a53321f3f52c', '657425e280b5b09c93b4a284', 'inside', items, flatItems)).toEqual([
      {
        id: '657425e280b5b09c93b4a284',
        label: 'Page',
        icon: 'fa-solid fa-square',
        items: [
          { id: '672a10680e69f90f255f81ed', label: 'Heading 1' },
          { id: '672a9fb7d8a5a53321f3f52c', label: 'Heading 2' },
          { id: '678226237479ee7d61c55cc2', label: 'Container', items: [] },
          { id: '672a9fb8d8a5a53321f3f52c', label: 'Heading 3' }
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
    ]);
  });

  it('Utils invalid moveNode', () => {
    const items = [
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
    ];
    const flatItems = getFlatItems(items);

    expect(moveNode('672a9fb8d8a5a53321f3f52c', '672a10680e69f90f255f81ed', 'inside', items, flatItems)).toEqual(
      undefined
    );
    expect(moveNode('672a9fb8d8a5a53321f3f52c', '657425e280b5b09c93b4a284', 'top', items, flatItems)).toEqual(
      undefined
    );
    expect(moveNode('672a9fb8d8a5a53321f3f52c', '678226237479ee7d61c55cc2', 'inside', items, flatItems)).toEqual(
      undefined
    );
  });

  it('moveNode within same parent keeps order stable (top)', () => {
    const items = [
      {
        id: 'p',
        label: 'Parent',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' }
        ]
      }
    ];

    const flat = getFlatItems(items);

    const res = moveNode('c', 'a', 'top', items, flat);
    expect(res?.[0].items?.map(i => i.id)).toEqual(['c', 'a', 'b']);
  });

  it('moveNode within same parent keeps order stable (bottom)', () => {
    const items = [
      {
        id: 'p',
        label: 'Parent',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' }
        ]
      }
    ];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'b', 'bottom', items, flat);
    expect(res?.[0].items?.map(i => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('moveNode into another parent (inside)', () => {
    const items = [
      {
        id: 'p1',
        label: 'P1',
        items: [{ id: 'a', label: 'A' }]
      },
      {
        id: 'p2',
        label: 'P2',
        items: []
      }
    ];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'p2', 'inside', items, flat);

    expect(res?.[0].items).toEqual([]);
    expect(res?.[1].items?.map(i => i.id)).toEqual(['a']);
  });

  it('moveNode should not duplicate nodes', () => {
    const items = [
      {
        id: 'p',
        label: 'Parent',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' }
        ]
      }
    ];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'b', 'bottom', items, flat);

    const ids = res?.[0].items?.map(i => i.id) || [];
    const occurrences = ids.filter(id => id === 'a').length;

    expect(occurrences).toBe(1);
  });

  it('moveNode should return undefined if target not found', () => {
    const items = [
      {
        id: 'p',
        label: 'Parent',
        items: [{ id: 'a', label: 'A' }]
      }
    ];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'missing', 'top', items, flat);
    expect(res).toBeUndefined();
  });

  it('should not move node into itself', () => {
    const items = [{ id: 'a', label: 'A', items: [{ id: 'b', label: 'B' }] }];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'a', 'inside', items, flat);
    expect(res).toBeUndefined();
  });

  it('should not move node into its own child', () => {
    const items = [{ id: 'a', label: 'A', items: [{ id: 'b', label: 'B' }] }];

    const flat = getFlatItems(items);

    const res = moveNode('a', 'b', 'inside', items, flat);
    expect(res).toBeUndefined();
  });
});
