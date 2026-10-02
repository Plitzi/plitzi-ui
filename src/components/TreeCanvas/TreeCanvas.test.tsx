import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TreeCanvas from './TreeCanvas';

import type { TreeCanvasItem } from './layout';

// jsdom lays nothing out: the canvas has no size, so it fits nothing and draws at zoom 1 offset by its padding (48px).
const PADDING = 48;
const SIZE = { nodeWidth: 100, nodeHeight: 50, gapX: 20, gapY: 30 };

const items: TreeCanvasItem<string>[] = [
  { id: 'folder', data: 'Folder', container: true, children: [{ id: 'inside', data: 'Inside' }] },
  { id: 'page', data: 'Page' }
];

const renderCanvas = (props: Partial<Parameters<typeof TreeCanvas<string>>[0]> = {}) =>
  render(
    <TreeCanvas<string>
      testId="canvas"
      items={items}
      renderNode={(item, state) => (
        <span>
          {item.data}
          {state.dropTarget && ' — drop here'}
          {state.dimmed && ' — dimmed'}
        </span>
      )}
      {...SIZE}
      {...props}
    />
  );

/** Moves the pointer on the window, where a drag listens once it has started. */
const pointer = (type: 'pointermove' | 'pointerup', clientX: number, clientY: number) =>
  act(() => {
    window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
  });

describe('TreeCanvas', () => {
  it('draws every item where the layout puts it, and an edge from each parent to each child', () => {
    const { container } = renderCanvas();

    expect(screen.getByRole('tree')).toBeDefined();
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    expect(container.querySelectorAll('path')).toHaveLength(1);
    expect(container.querySelector('[data-tree-canvas-node="inside"]')?.getAttribute('aria-level')).toBe('2');
  });

  it('selects an item that is clicked, and nothing when the empty canvas is', () => {
    const onSelect = vi.fn();
    renderCanvas({ onSelect });

    fireEvent.pointerDown(screen.getByText('Page'), { button: 0, clientX: 200, clientY: 60 });
    pointer('pointerup', 200, 60);
    expect(onSelect).toHaveBeenLastCalledWith('page');

    fireEvent.pointerDown(screen.getByTestId('canvas'), { button: 0, clientX: 600, clientY: 600 });
    pointer('pointerup', 600, 600);
    expect(onSelect).toHaveBeenLastCalledWith(undefined);
  });

  it('deletes the selected item with Delete, and only that one', () => {
    const onDelete = vi.fn();
    renderCanvas({ selectedId: 'page', onDelete });

    fireEvent.keyDown(screen.getByTestId('canvas'), { key: 'Delete' });

    expect(onDelete).toHaveBeenCalledWith('page');
  });

  it('zooms from the keyboard and says how far in it is', () => {
    renderCanvas();

    fireEvent.keyDown(screen.getByTestId('canvas'), { key: '+' });
    expect(screen.getByText('120%')).toBeDefined();

    fireEvent.keyDown(screen.getByTestId('canvas'), { key: '0' });
    expect(screen.getByText('100%')).toBeDefined();
  });

  it('moves an item dropped onto a container into it, and nothing dropped onto nothing', () => {
    const onMove = vi.fn();
    renderCanvas({ onMove });
    // The top-level page heads the leaves' column at x 32; the folder holding `inside` follows at x 168.
    const page = { x: PADDING + 32 + 10, y: PADDING + 10 };
    const folder = { x: PADDING + 168 + 10, y: PADDING + 10 };

    fireEvent.pointerDown(screen.getByText('Page'), { button: 0, clientX: page.x, clientY: page.y });
    pointer('pointermove', folder.x, folder.y);
    expect(screen.getByText('Folder — drop here', { exact: false })).toBeDefined();
    pointer('pointerup', folder.x, folder.y);
    expect(onMove).toHaveBeenCalledWith('page', 'folder');

    onMove.mockClear();
    fireEvent.pointerDown(screen.getByText('Page'), { button: 0, clientX: page.x, clientY: page.y });
    pointer('pointermove', 900, 900);
    pointer('pointerup', 900, 900);
    expect(onMove).not.toHaveBeenCalled();
  });

  it('never drops a container into itself, and offers the top level only to what lives in one', () => {
    const onMove = vi.fn();
    renderCanvas({ onMove });
    const folder = { x: PADDING + 168 + 10, y: PADDING + 10 };

    fireEvent.pointerDown(screen.getByText('Folder'), { button: 0, clientX: folder.x, clientY: folder.y });
    pointer('pointermove', folder.x + 20, folder.y);
    expect(screen.queryByText('Move to the top level')).toBeNull();
    pointer('pointerup', folder.x + 20, folder.y);
    expect(onMove).not.toHaveBeenCalled();

    const inside = { x: PADDING + 184 + 10, y: PADDING + 80 + 10 };
    fireEvent.pointerDown(screen.getByText('Inside'), { button: 0, clientX: inside.x, clientY: inside.y });
    pointer('pointermove', inside.x + 30, inside.y);
    expect(screen.getByText('Move to the top level')).toBeDefined();
    pointer('pointerup', inside.x + 30, inside.y);
  });

  it('folds a branch away and back, with a button that says how many it holds', () => {
    const onToggleCollapsed = vi.fn();
    const { rerender } = renderCanvas({ onToggleCollapsed });

    fireEvent.click(screen.getByTitle('Fold'));
    expect(onToggleCollapsed).toHaveBeenCalledWith('folder');

    rerender(
      <TreeCanvas<string>
        items={items}
        renderNode={item => <span>{item.data}</span>}
        {...SIZE}
        collapsedIds={['folder']}
        onToggleCollapsed={onToggleCollapsed}
      />
    );
    expect(screen.queryByText('Inside')).toBeNull();
    expect(screen.getByTitle('Show the 1 inside')).toBeDefined();
  });

  it('walks the tree with the arrows, and opens what is selected with Enter or a double click', () => {
    const onSelect = vi.fn();
    const onActivate = vi.fn();
    const { rerender } = renderCanvas({ selectedId: 'folder', onSelect, onActivate });
    const tree = screen.getByRole('tree');

    fireEvent.keyDown(tree, { key: 'ArrowDown' });
    expect(onSelect).toHaveBeenLastCalledWith('inside');
    fireEvent.keyDown(tree, { key: 'ArrowLeft' });
    expect(onSelect).toHaveBeenLastCalledWith('page');
    fireEvent.keyDown(tree, { key: 'Enter' });
    expect(onActivate).toHaveBeenLastCalledWith('folder');

    rerender(
      <TreeCanvas<string>
        items={items}
        renderNode={item => <span>{item.data}</span>}
        {...SIZE}
        selectedId="inside"
        onSelect={onSelect}
        onActivate={onActivate}
      />
    );
    fireEvent.keyDown(screen.getByRole('tree'), { key: 'ArrowUp' });
    expect(onSelect).toHaveBeenLastCalledWith('folder');
    fireEvent.doubleClick(screen.getByText('Inside'));
    expect(onActivate).toHaveBeenLastCalledWith('inside');
  });

  it('dims everything a search did not find', () => {
    renderCanvas({ highlightIds: new Set(['page']) });

    expect(screen.getByText('Folder — dimmed')).toBeDefined();
    expect(screen.queryByText('Page — dimmed')).toBeNull();
  });
});
