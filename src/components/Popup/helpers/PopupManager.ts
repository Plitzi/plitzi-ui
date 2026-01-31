import type { PopupPlacement } from '../Popup';
import type { PopupInstance } from '../PopupProvider';

type PopupStore<P extends PopupPlacement> = {
  [K in P]: PopupInstance[];
};

type PopupUpdateListener<P extends PopupPlacement> = (placement: P, timestamp: number) => void;

export class PopupManager<P extends PopupPlacement> {
  private store: PopupStore<P>;
  private lastUpdate: Record<P, number>;
  private listeners = new Set<PopupUpdateListener<P>>();
  private multi: boolean;

  constructor(placements: readonly P[], popups?: Partial<PopupStore<P>>, options?: { multi?: boolean }) {
    this.store = {} as PopupStore<P>;
    this.lastUpdate = {} as Record<P, number>;
    this.multi = options?.multi ?? true;

    for (const placement of placements) {
      const sorted = this.sortByPosition(popups?.[placement] ?? [], placement);
      if (this.multi) {
        this.store[placement] = sorted;
      } else {
        let foundActive = false;
        this.store[placement] = sorted.map(popup => {
          if (popup.active && !foundActive) {
            foundActive = true;
            return popup;
          }

          if (popup.active && foundActive) {
            return { ...popup, active: false };
          }

          return popup;
        });
      }

      this.lastUpdate[placement] = Date.now();
    }
  }

  /* ---------- helpers ---------- */

  private sortByPosition(list: PopupInstance[], placement: P): PopupInstance[] {
    const isFloating = placement === ('floating' as P);

    return list
      .map((popup, index) => ({ popup, index }))
      .sort((a, b) => {
        const pa = a.popup.placementSettings?.[placement]?.position;
        const pb = b.popup.placementSettings?.[placement]?.position;

        // both have position
        if (typeof pa === 'number' && typeof pb === 'number') {
          return isFloating ? pb - pa : pa - pb;
        }

        // only A has position
        if (typeof pa === 'number') {
          return isFloating ? 1 : -1;
        }

        // only B has position
        if (typeof pb === 'number') {
          return isFloating ? -1 : 1;
        }

        // stable fallback
        return a.index - b.index;
      })
      .map(({ popup }) => popup);
  }

  private assertPlacement(placement: P): void {
    if (!(this.store[placement] as PopupInstance[] | undefined)) {
      throw new Error(`Invalid placement: ${placement}`);
    }
  }

  onUpdate(listener: PopupUpdateListener<P>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private touch(placement: P): void {
    const ts = Date.now();
    this.lastUpdate[placement] = ts;

    for (const listener of this.listeners) {
      listener(placement, ts);
    }
  }

  /* ---------- public API ---------- */

  getAll(): PopupStore<P> {
    const result = {} as PopupStore<P>;
    for (const placement in this.store) {
      result[placement] = [...this.store[placement]];
    }

    return result;
  }

  /* ---------- get overloads ---------- */
  get(placement: P): PopupInstance[];
  get(placement: P | undefined, popupId: string): PopupInstance | undefined;
  get(placement: P | undefined, popupId?: string): PopupInstance[] | PopupInstance | undefined {
    if (!placement) {
      for (const placementAux in this.store) {
        const popup = this.store[placementAux].find(p => p.id === popupId);
        if (popup) {
          return popup;
        }
      }

      return undefined;
    }

    this.assertPlacement(placement);
    if (popupId !== undefined) {
      return this.store[placement].find(popup => popup.id === popupId);
    }

    return [...this.store[placement]];
  }

  getPlacement(popupId: string): P | undefined {
    for (const placement in this.store) {
      if (this.store[placement].some(p => p.id === popupId)) {
        return placement;
      }
    }

    return undefined;
  }

  getCount(placement: P): number {
    this.assertPlacement(placement);

    return this.store[placement].length;
  }

  getLastUpdate(placement: P): number {
    this.assertPlacement(placement);

    return this.lastUpdate[placement];
  }

  getPlacementByPopup(): Record<string, P> {
    const cache: Record<string, P> = {};
    for (const placement in this.store) {
      for (const popup of this.store[placement]) {
        cache[popup.id] = placement;
      }
    }

    return cache;
  }

  exists(id: string, placement?: P): boolean {
    if (placement !== undefined) {
      this.assertPlacement(placement);

      return this.store[placement].some(p => p.id === id);
    }

    for (const p in this.store) {
      if (this.store[p as P].some(popup => popup.id === id)) {
        return true;
      }
    }

    return false;
  }

  add(placement: P, popup: PopupInstance): boolean {
    this.assertPlacement(placement);
    if (this.store[placement].some(p => p.id === popup.id)) {
      return false;
    }

    let next = [...this.store[placement], popup];
    if (!this.multi && popup.active) {
      let foundActive = false;
      next = next.map(p => {
        if (p.active && !foundActive) {
          foundActive = true;
          return p;
        }

        if (p.active && foundActive) {
          return { ...p, active: false };
        }

        return p;
      });
    }

    this.store[placement] = this.sortByPosition(next, placement);
    this.touch(placement);

    return true;
  }

  remove(id: string): boolean {
    let removed = false;
    for (const placement in this.store) {
      const originalLength = this.store[placement as P].length;
      this.store[placement as P] = this.store[placement as P].filter(p => p.id !== id);
      if (this.store[placement as P].length !== originalLength) {
        removed = true;
        this.touch(placement as P);
      }
    }
    return removed;
  }

  move(id: string, from: P, to: P): boolean {
    this.assertPlacement(from);
    this.assertPlacement(to);
    if (from === to) {
      return false;
    }

    const popup = this.store[from].find(p => p.id === id);
    if (!popup) {
      return false;
    }

    this.store[from] = this.store[from].filter(p => p.id !== id);
    this.store[to] = this.sortByPosition([...this.store[to], popup], to);
    this.setActive(id, true, to, true);
    this.touch(from);
    this.touch(to);

    return true;
  }

  focusFloating(id: string): void {
    const placement = 'floating' as P;
    this.assertPlacement(placement);

    const list = this.store[placement];
    const index = list.findIndex(p => p.id === id);

    if (index === -1) {
      return;
    }

    const popup = list[index];
    if (index === list.length - 1) {
      return;
    }

    this.store[placement] = [...list.slice(0, index), ...list.slice(index + 1), popup];
    this.touch(placement);
  }

  changePlacement(id: string, to: P): boolean {
    this.assertPlacement(to);

    // cannot move if popup already exists in target placement
    if (this.store[to].some(popup => popup.id === id)) {
      return false;
    }

    for (const placement in this.store) {
      const from = placement as P;
      if (from === to) {
        continue;
      }

      const index = this.store[from].findIndex(p => p.id === id);
      if (index === -1) {
        continue;
      }

      const popup = this.store[from][index];

      // remove from source placement
      this.store[from] = this.store[from].filter(p => p.id !== id);
      if (popup.active && !this.multi && this.store[from].length > 0) {
        this.store[from][0].active = true;
      }

      // enforce single-active rule on target if needed
      let nextTarget = [...this.store[to], popup];

      if (!this.multi && popup.active) {
        nextTarget = nextTarget.map(p => (p.id === popup.id ? p : { ...p, active: false }));
      }

      this.store[to] = this.sortByPosition(nextTarget, to);

      this.touch(from);
      this.touch(to);

      return true;
    }

    return false;
  }

  update(id: string, updater: (popup: PopupInstance) => PopupInstance): boolean {
    for (const placement in this.store) {
      const list = this.store[placement as P];
      const index = list.findIndex(p => p.id === id);
      if (index !== -1) {
        const updated = updater(list[index]);
        this.store[placement as P] = this.sortByPosition(
          [...list.slice(0, index), updated, ...list.slice(index + 1)],
          placement as P
        );
        this.touch(placement as P);

        return true;
      }
    }
    return false;
  }

  setActive(id: string, active: boolean, placement?: P, isMoving = false): boolean {
    for (const placementKey in this.store) {
      if (placement && placement !== placementKey) {
        continue;
      }

      let list = this.store[placementKey];
      const index = list.findIndex(popup => popup.id === id);
      if (index === -1) {
        continue;
      }

      const popup = list[index];
      if (popup.active === active && !isMoving) {
        return false;
      }

      const multi =
        this.multi &&
        (popup.placementSettings?.[placementKey]?.multi === undefined || popup.placementSettings[placementKey].multi);
      if (!multi && active) {
        list = list.map(p => (p.id === id ? { ...p, active: true } : { ...p, active: false }));
      } else {
        const updated: PopupInstance = { ...popup, active };
        list = [...list.slice(0, index), updated, ...list.slice(index + 1)];
        if (active) {
          list = list.map(p => (p.id === id ? { ...p, active: true } : { ...p, active: false }));
        }
      }

      this.store[placementKey] = list;
      this.touch(placementKey);

      return true;
    }

    return false;
  }

  setActiveMany(ids: string[], placement: P): boolean {
    this.assertPlacement(placement);

    const lastId = ids[ids.length - 1];
    if (!this.multi) {
      return lastId ? this.setActive(lastId, true, placement) : false;
    }

    let list = this.store[placement];
    let changed = false as boolean;

    const lastPopup = list.find(p => p.id === lastId);
    if (lastPopup && lastPopup.placementSettings?.[placement]?.multi === false) {
      ids = [lastPopup.id];
    } else {
      const popupIdsSingleMode = list.filter(p => p.placementSettings?.[placement]?.multi === false).map(p => p.id);
      ids = ids.filter(id => !popupIdsSingleMode.includes(id));
    }

    const idSet = new Set(ids);
    list = list.map(popup => {
      const shouldBeActive = idSet.has(popup.id);
      if (popup.active === shouldBeActive) {
        return popup;
      }

      changed = true;

      return { ...popup, active: shouldBeActive };
    });

    if (!changed) {
      return false;
    }

    this.store[placement] = list;
    this.touch(placement);

    return true;
  }

  clear(placement?: P): void {
    if (placement) {
      this.assertPlacement(placement);
      this.store[placement] = [];
      this.touch(placement);

      return;
    }

    for (const p in this.store) {
      this.store[p as P] = [];
      this.touch(p as P);
    }
  }
}

export default PopupManager;
