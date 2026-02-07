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

    it('restores auto-grow when second panel is removed after resize', () => {
      const refA = createRef();
      const refB = createRef();

      refA.current = document.createElement('div');
      refB.current = document.createElement('div');

      manager.register('a', refA);
      manager.register('b', refB);

      manager.toggle('a');
      manager.toggle('b');

      const panelA = manager.get('a');
      expect(expect).not.toBe(undefined);
      if (!panelA) {
        return;
      }

      // Simulate resize (manual size applied)
      refA.current.style.flexBasis = '200px';
      refA.current.style.flexGrow = '0';
      panelA.hasManualSize = true;

      // Sanity check
      expect(panelA.hasManualSize).toBe(true);

      // Remove second panel
      manager.unregister('b');

      // Panel A should return to auto-grow
      expect(panelA.hasManualSize).toBe(false);
      expect(refA.current.style.flexBasis).toBe('');
      expect(refA.current.style.flexGrow).toBe('');
    });

    it('alwaysOpen=true: removing one active keeps others active', () => {
      const manager = new AccordionManager(containerRef, {
        multi: true,
        alwaysOpen: true,
        defaultActive: ['a', 'b']
      });

      manager.register('a', createRef());
      manager.register('b', createRef());
      manager.register('c', createRef());

      manager.unregister('a');

      const actives = manager.getActives().map(p => p.id);
      expect(actives).toEqual(['b']);
    });

    it('alwaysOpen=true: removing last active opens another panel', () => {
      const manager = new AccordionManager(containerRef, {
        multi: true,
        alwaysOpen: true,
        defaultActive: ['a']
      });

      manager.register('a', createRef());
      manager.register('b', createRef());
      manager.register('c', createRef());

      manager.unregister('a');

      expect(manager.getActives()).toHaveLength(1);
      expect(manager.isOpen('b')).toBe(true);
    });

    it('removing the last panel leaves no actives even with alwaysOpen=true', () => {
      const manager = new AccordionManager(containerRef, {
        alwaysOpen: true,
        defaultActive: ['a']
      });

      manager.register('a', createRef());

      manager.unregister('a');

      expect(manager.get()).toHaveLength(0);
      expect(manager.getActives()).toHaveLength(0);
    });

    it('alwaysOpen=true: after removing all panels, newly added panel auto-opens', () => {
      const manager = new AccordionManager(containerRef, {
        multi: true,
        alwaysOpen: true
      });

      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.unregister('a');
      manager.unregister('b');

      expect(manager.get()).toHaveLength(0);
      expect(manager.getActives()).toHaveLength(0);

      manager.register('c', createRef());

      expect(manager.getActives()).toHaveLength(1);
      expect(manager.isOpen('c')).toBe(true);
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

    it('alwaysOpen=true: removing active panel opens another one', () => {
      const manager = new AccordionManager(containerRef, {
        multi: false,
        alwaysOpen: true,
        defaultActive: ['a']
      });

      manager.register('a', createRef());
      manager.register('b', createRef());

      expect(manager.getActives().map(p => p.id)).toEqual(['a']);

      manager.unregister('a');

      expect(manager.getActives()).toHaveLength(1);
      expect(manager.isOpen('b')).toBe(true);
    });

    it('alwaysOpen=false: removing active panel leaves no active panels', () => {
      const manager = new AccordionManager(containerRef, {
        multi: false,
        alwaysOpen: false,
        defaultActive: ['a']
      });

      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.unregister('a');

      expect(manager.getActives()).toHaveLength(0);
    });

    it('unregistering a non-active panel does not change actives', () => {
      const manager = new AccordionManager(containerRef, {
        multi: false,
        alwaysOpen: true,
        defaultActive: ['a']
      });

      manager.register('a', createRef());
      manager.register('b', createRef());

      manager.unregister('b');

      expect(manager.getActives().map(p => p.id)).toEqual(['a']);
    });

    it('alwaysOpen=true: after removing all panels, newly added panel auto-opens', () => {
      const manager = new AccordionManager(containerRef, {
        multi: false,
        alwaysOpen: true
      });

      manager.register('a', createRef());
      manager.unregister('a');

      expect(manager.get()).toHaveLength(0);
      expect(manager.getActives()).toHaveLength(0);

      manager.register('b', createRef());

      expect(manager.getActives()).toHaveLength(1);
      expect(manager.isOpen('b')).toBe(true);
    });
  });

  /* ====================================================================== */
  /* ALWAYS OPEN                                                            */
  /* ====================================================================== */

  describe('alwaysOpen', () => {
    it('prevents closing the last active panel', () => {
      const manager = new AccordionManager(containerRef, { multi: false, alwaysOpen: true });

      manager.register('a', createRef());
      expect(manager.isOpen('a')).toBe(true);

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
