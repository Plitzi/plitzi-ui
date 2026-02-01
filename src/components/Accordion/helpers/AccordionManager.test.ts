import { describe, it, expect, beforeEach, vi } from 'vitest';

import AccordionManager from './AccordionManager';

import type { RefObject } from 'react';

const createRef = (height = 100): RefObject<HTMLElement> =>
  ({
    current: { offsetHeight: height, style: {}, compareDocumentPosition: () => 0 } as unknown as HTMLElement
  }) as RefObject<HTMLElement>;

describe('AccordionManager', () => {
  let containerRef: RefObject<HTMLElement>;

  beforeEach(() => {
    containerRef = {
      current: { style: {} } as HTMLElement
    };
  });

  /* ====================================================================== */
  /* GET                                                                    */
  /* ====================================================================== */

  it('get() returns all panels', () => {
    const manager = new AccordionManager(containerRef);

    manager.register('a', createRef());
    manager.register('b', createRef());

    expect(manager.get().map(p => p.id)).toEqual(['a', 'b']);
  });

  it('get(id) returns a panel by id', () => {
    const manager = new AccordionManager(containerRef);

    manager.register('a', createRef());

    expect(manager.get('a')?.id).toBe('a');
  });

  it('get(id) returns undefined for missing id', () => {
    const manager = new AccordionManager(containerRef);
    expect(manager.get('missing')).toBeUndefined();
  });

  /* ====================================================================== */
  /* MULTI MODE                                                             */
  /* ====================================================================== */

  describe('multi mode', () => {
    let manager: AccordionManager;

    beforeEach(() => {
      manager = new AccordionManager(containerRef, { multi: true });
    });

    it('register multiple active items', () => {
      const manager = new AccordionManager(containerRef, { multi: true, alwaysOpen: true, defaultActive: ['a', 'b'] });
      manager.register('a', createRef());
      manager.register('b', createRef());

      expect(manager.isOpen('a')).toBe(true);
      expect(manager.isOpen('b')).toBe(true);
    });

    it('allows multiple panels to be open', () => {
      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.toggle('a');
      manager.toggle('b');

      expect(manager.isOpen('a')).toBe(true);
      expect(manager.isOpen('b')).toBe(true);
    });

    it('canResize requires current and next panel to be active', () => {
      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.toggle('a');
      manager.toggle('b');

      expect(manager.canResize('a')).toBe(true);
    });
  });

  /* ====================================================================== */
  /* SINGLE MODE                                                            */
  /* ====================================================================== */

  describe('single mode', () => {
    let manager: AccordionManager;

    beforeEach(() => {
      manager = new AccordionManager(containerRef, { multi: false });
    });

    it('register multiple active items', () => {
      const manager = new AccordionManager(containerRef, { multi: false, alwaysOpen: true, defaultActive: ['a', 'b'] });
      manager.register('a', createRef());
      manager.register('b', createRef());

      expect(manager.isOpen('a')).toBe(true);
      expect(manager.isOpen('b')).toBe(false);
    });

    it('opening a panel closes the previously open one', () => {
      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.toggle('a');
      manager.toggle('b');

      expect(manager.isOpen('a')).toBe(false);
      expect(manager.isOpen('b')).toBe(true);
    });

    it('canResize is false because only one panel can be active', () => {
      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.toggle('a');
      manager.toggle('b');

      expect(manager.canResize('a')).toBe(false);
    });
  });

  /* ====================================================================== */
  /* ALWAYS OPEN                                                            */
  /* ====================================================================== */

  describe('alwaysOpen', () => {
    it('prevents closing the last active panel', () => {
      const manager = new AccordionManager(containerRef, { multi: false, alwaysOpen: true });

      manager.register('a', createRef());
      expect(manager.isOpen('a')).toBe(false);

      manager.toggle('a');
      expect(manager.isOpen('a')).toBe(true);

      manager.toggle('a');
      expect(manager.isOpen('a')).toBe(true);
    });
  });

  /* ====================================================================== */
  /* UPDATE LISTENERS                                                       */
  /* ====================================================================== */

  it('onUpdate listener is called on register', () => {
    const manager = new AccordionManager(containerRef);
    const listener = vi.fn();

    manager.onUpdate(listener);
    manager.register('a', createRef());

    expect(listener).toHaveBeenCalled();
  });

  it('onUpdate unsubscribe works', () => {
    const manager = new AccordionManager(containerRef);
    const listener = vi.fn();

    const unsubscribe = manager.onUpdate(listener);
    unsubscribe();

    manager.register('a', createRef());

    expect(listener).not.toHaveBeenCalled();
  });

  /* ====================================================================== */
  /* EDGE CASES                                                             */
  /* ====================================================================== */

  it('toggle on missing id is a no-op', () => {
    const manager = new AccordionManager(containerRef);
    manager.toggle('missing');

    expect(manager.get()).toHaveLength(0);
  });

  it('register ignores panels without ref.current', () => {
    const manager = new AccordionManager(containerRef);

    manager.register('a', { current: null });

    expect(manager.get()).toHaveLength(0);
  });

  it('unregister on missing id is safe', () => {
    const manager = new AccordionManager(containerRef);

    manager.unregister('missing');

    expect(manager.get()).toHaveLength(0);
  });
});
