import { describe, it, expect, beforeEach } from 'vitest';

import PopupManager from './PopupManager';

import type { PopupPlacement, PopupSettings } from '../Popup';
import type { PopupInstance } from '../PopupProvider';

/* ---------- helpers ---------- */

const createPopup = (id: string, position?: number): PopupInstance => ({
  id,
  component: null,
  active: true,
  position,
  settings: {} as PopupSettings
});

/* ---------- tests ---------- */

describe('PopupManager', () => {
  let manager: PopupManager<PopupPlacement>;

  beforeEach(() => {
    manager = new PopupManager(['left', 'right', 'floating'] as const);
  });

  it('adds a popup to a placement', () => {
    expect(manager.add('left', createPopup('a', 1))).toBe(true);

    expect(manager.get('left')).toHaveLength(1);
    expect(manager.get('left')[0].id).toBe('a');
  });

  it('sorts popups by position', () => {
    expect(manager.add('left', createPopup('a', 2))).toBe(true);
    expect(manager.add('left', createPopup('b', 1))).toBe(true);
    expect(manager.add('left', createPopup('c'))).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['b', 'a', 'c']);
  });

  it('keeps stable order when position is undefined', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.add('left', createPopup('b'))).toBe(true);
    expect(manager.add('left', createPopup('c'))).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('removes a popup from all placements', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.add('right', createPopup('b'))).toBe(true);

    expect(manager.remove('a')).toBe(true);

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(1);
  });

  it('moves a popup between placements explicitly', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);

    expect(manager.move('a', 'left', 'right')).toBe(true);

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')[0].id).toBe('a');
  });

  it('changes placement without knowing the source', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);

    expect(manager.changePlacement('a', 'floating')).toBe(true);

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('floating')[0].id).toBe('a');
  });

  it('does nothing if changePlacement is called with a missing id', () => {
    expect(manager.changePlacement('missing', 'right')).toBe(false);

    expect(manager.get('right')).toHaveLength(0);
  });

  it('re-sorts when a popup is updated', () => {
    expect(manager.add('left', createPopup('a', 2))).toBe(true);
    expect(manager.add('left', createPopup('b', 1))).toBe(true);

    expect(manager.update('a', p => ({ ...p, position: 0 }))).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['a', 'b']);
  });

  it('clears a specific placement', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.add('right', createPopup('b'))).toBe(true);

    manager.clear('left');

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(1);
  });

  it('clears all placements when no argument is provided', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.add('right', createPopup('b'))).toBe(true);

    manager.clear();

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(0);
  });

  it('getAll returns a deep clone (no state leaks)', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);

    const all = manager.getAll();
    all.left.push(createPopup('b'));

    expect(manager.get('left')).toHaveLength(1);
  });

  it('does nothing when moving a popup to the same placement', () => {
    expect(manager.add('left', createPopup('a', 1))).toBe(true);

    expect(manager.move('a', 'left', 'left')).toBe(false);

    expect(manager.get('left')).toHaveLength(1);
    expect(manager.get('left')[0].id).toBe('a');
  });

  it('does nothing when changePlacement is called with same placement', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);

    expect(manager.changePlacement('a', 'left')).toBe(false);

    expect(manager.get('left')).toHaveLength(1);
    expect(manager.get('floating')).toHaveLength(0);
  });

  it('does nothing when move is called with a missing id', () => {
    expect(manager.move('missing', 'left', 'right')).toBe(false);

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(0);
  });

  it('keeps stable order when multiple popups share the same position', () => {
    expect(manager.add('left', createPopup('a', 1))).toBe(true);
    expect(manager.add('left', createPopup('b', 1))).toBe(true);
    expect(manager.add('left', createPopup('c', 1))).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('places popups without position after positioned ones', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.add('left', createPopup('b', 1))).toBe(true);
    expect(manager.add('left', createPopup('c'))).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['b', 'a', 'c']);
  });

  it('does nothing when updating a non-existing popup', () => {
    expect(manager.update('missing', p => ({ ...p, position: 0 }))).toBe(false);

    expect(manager.get('left')).toHaveLength(0);
  });

  it('allows update without changing position', () => {
    expect(manager.add('left', createPopup('a', 1))).toBe(true);

    expect(manager.update('a', p => ({ ...p, active: false }))).toBe(true);

    expect(manager.get('left')[0].active).toBe(false);
  });

  it('remove is idempotent (can be called multiple times safely)', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);

    expect(manager.remove('a')).toBe(true);
    expect(manager.remove('a')).toBe(false);

    expect(manager.get('left')).toHaveLength(0);
  });

  it('never duplicates a popup across placements', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.changePlacement('a', 'right')).toBe(true);

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(1);
  });

  it('preserves order when moving between placements', () => {
    expect(manager.add('right', createPopup('a', 2))).toBe(true);
    expect(manager.add('right', createPopup('b', 1))).toBe(true);

    expect(manager.changePlacement('b', 'left')).toBe(true);
    expect(manager.changePlacement('a', 'left')).toBe(true);

    expect(manager.get('left').map(p => p.id)).toEqual(['b', 'a']);
  });

  it('clear on empty placement does not throw', () => {
    manager.clear('left');

    expect(manager.get('left')).toHaveLength(0);
  });

  it('clear all is idempotent', () => {
    manager.clear();
    manager.clear();

    expect(manager.get('left')).toHaveLength(0);
    expect(manager.get('right')).toHaveLength(0);
  });

  it('add returns false if popup with same id exists in placement', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    // Try to add again with same id
    expect(manager.add('left', createPopup('a'))).toBe(false);
    expect(manager.get('left')).toHaveLength(1);
  });

  it('remove returns false if popup does not exist', () => {
    expect(manager.remove('not-here')).toBe(false);
  });

  it('update returns false if popup does not exist', () => {
    expect(manager.update('not-here', p => p)).toBe(false);
  });

  it('move returns false if popup does not exist in "from" placement', () => {
    expect(manager.move('not-here', 'left', 'right')).toBe(false);
  });

  it('move returns false if moving to same placement', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.move('a', 'left', 'left')).toBe(false);
  });

  it('changePlacement returns false if id not found or placement is same', () => {
    expect(manager.changePlacement('not-there', 'left')).toBe(false);
    expect(manager.add('left', createPopup('x'))).toBe(true);
    expect(manager.changePlacement('x', 'left')).toBe(false);
  });

  it('exists returns true for any placement if present, false otherwise', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.exists('a')).toBe(true);
    expect(manager.exists('a', 'left')).toBe(true);
    expect(manager.exists('a', 'right')).toBe(false);
    expect(manager.exists('not-there')).toBe(false);
  });

  it('exists works for optional placement argument', () => {
    expect(manager.add('right', createPopup('b'))).toBe(true);
    expect(manager.exists('b')).toBe(true);
    expect(manager.exists('b', 'right')).toBe(true);
    expect(manager.exists('b', 'left')).toBe(false);
  });

  it('focusFloating moves popup to the last position in floating', () => {
    expect(manager.add('floating', createPopup('a'))).toBe(true);
    expect(manager.add('floating', createPopup('b'))).toBe(true);
    expect(manager.add('floating', createPopup('c'))).toBe(true);
    // Current order: ['a', 'b', 'c']
    manager.focusFloating('b');
    expect(manager.get('floating').map(p => p.id)).toEqual(['a', 'c', 'b']);
    // If already last, nothing happens
    manager.focusFloating('b');
    expect(manager.get('floating').map(p => p.id)).toEqual(['a', 'c', 'b']);
    // If not found, nothing happens
    manager.focusFloating('not-there');
    expect(manager.get('floating').map(p => p.id)).toEqual(['a', 'c', 'b']);
  });

  it('get(placement, id) returns single popup or undefined', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    const popup = manager.get('left', 'a');
    expect(popup && popup.id).toBe('a');
    expect(manager.get('left', 'not-there')).toBeUndefined();
  });

  it('get(placement) returns array of popups', () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    expect(manager.get('left')).toBeInstanceOf(Array);
    expect(manager.get('left').length).toBe(1);
  });

  it('getLastUpdate changes after mutations', async () => {
    expect(manager.add('left', createPopup('a'))).toBe(true);
    const before = manager.getLastUpdate('left');
    // Wait so that time changes (simulate async)
    await new Promise(r => setTimeout(r, 2));
    manager.update('a', p => ({ ...p, active: false }));
    const after = manager.getLastUpdate('left');
    expect(after).toBeGreaterThan(before);
    // Remove also updates
    await new Promise(r => setTimeout(r, 2));
    manager.remove('a');
    const afterRemove = manager.getLastUpdate('left');
    expect(afterRemove).toBeGreaterThan(after);
  });
});
