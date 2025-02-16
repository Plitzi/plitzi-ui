import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
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
});
