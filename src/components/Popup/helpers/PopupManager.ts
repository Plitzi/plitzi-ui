import type { PopupPlacement } from '../Popup';
import type { PopupInstance } from '../PopupProvider';

export type PopupStore<P extends PopupPlacement> = { [K in P]: PopupInstance[] };
export type PopupUpdateState<P extends PopupPlacement = PopupPlacement> =
  | { item: PopupInstance; action: 'active'; value: boolean }
  | { item: PopupInstance[]; action: 'activeMany'; value: Record<string, boolean> }
  | { item: PopupInstance; action: 'added' }
  | { item: PopupInstance; action: 'updated' }
  | { item: PopupInstance; action: 'movedFrom'; value: P }
  | { item: PopupInstance; action: 'movedTo'; value: P }
  | { item: PopupInstance | PopupInstance[]; action: 'removed' };
export type PopupUpdateListener<P extends PopupPlacement> = (
  placement: P,
  timestamp: number,
  state: PopupUpdateState<P>
) => void;

export class PopupManager<P extends PopupPlacement> {
  private store: PopupStore<P>;
  lastUpdate: Record<P, number>;
  private listeners = new Set<PopupUpdateListener<P>>();
  private multi: boolean;
  private popupsAddedManually: string[] = [];

  constructor(placements: readonly P[], popups?: Partial<PopupStore<P>>, options?: { multi?: boolean }) {
    this.store = {} as PopupStore<P>;
    this.lastUpdate = {} as Record<P, number>;
    this.multi = options?.multi ?? true;

    for (const placement of placements) {
      const sorted = this.sortByPosition(popups?.[placement] ?? [], placement);
      if (this.multi) {
        this.store[placement] = sorted;
      } else {
        const popupActive = sorted.find(p => p.active);
        this.store[placement] = sorted.map(p => ({ ...p, active: popupActive?.id === p.id ? true : false }));
      }

      this.lastUpdate[placement] = Date.now();
    }
  }

  resync(popups: PopupStore<P>) {
    for (const placement in popups) {
      const popupsToKeep = this.store[placement].filter(p => this.popupsAddedManually.includes(p.id));
      const sorted = this.sortByPosition([...popups[placement], ...popupsToKeep], placement);
      if (this.multi) {
        this.store[placement] = sorted;
      } else {
        const popupActive = sorted.find(p => p.active);
        this.store[placement] = sorted.map(p => ({ ...p, active: popupActive?.id === p.id ? true : false }));
      }

      this.lastUpdate[placement] = Date.now();
    }
  }

  onUpdate(listener: PopupUpdateListener<P>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /* ---------- helpers ---------- */

  private sortByPosition(list: PopupInstance[], placement: P): PopupInstance[] {
    const isFloating = placement === 'floating';

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

  private touch(placement: P, state: PopupUpdateState<P>): void {
    const ts = Date.now();
    this.lastUpdate[placement] = ts;

    for (const listener of this.listeners) {
      listener(placement, ts, state);
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
      if (this.store[p].some(popup => popup.id === id)) {
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
    this.popupsAddedManually = [...this.popupsAddedManually, popup.id];
    this.touch(placement, { item: popup, action: 'added' });

    return true;
  }

  remove(id: string): boolean {
    let removed = false;
    for (const placement in this.store) {
      const popup = this.store[placement].find(p => p.id);
      if (popup) {
        removed = true;
        this.store[placement] = this.store[placement].filter(p => p.id !== id);
        this.touch(placement, { item: popup, action: 'removed' });
      }
    }

    if (removed) {
      this.popupsAddedManually = this.popupsAddedManually.filter(popupId => popupId !== id);
    }

    return removed;
  }

  move(id: string, from: P | undefined, to: P): boolean {
    if (!from) {
      for (const placement in this.store) {
        const index = this.store[placement].findIndex(p => p.id === id);
        if (index === -1) {
          continue;
        }

        from = placement;
      }
    }

    if (!from) {
      return false;
    }

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
    if (popup.active && !this.multi && this.store[from].length > 0) {
      this.store[from][0].active = true;
    }

    this.store[to] = this.sortByPosition([...this.store[to], popup], to);
    this.setActive(id, true, to, true);
    this.touch(from, { item: popup, action: 'movedFrom', value: from });
    this.touch(to, { item: popup, action: 'movedTo', value: to });

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
    this.touch(placement, { item: popup, action: 'active', value: true });
  }

  update(id: string, updater: (popup: PopupInstance) => PopupInstance): boolean {
    for (const placement in this.store) {
      const list = this.store[placement];
      const index = list.findIndex(p => p.id === id);
      if (index !== -1) {
        const updated = updater(list[index]);
        this.store[placement] = this.sortByPosition(
          [...list.slice(0, index), updated, ...list.slice(index + 1)],
          placement
        );
        this.touch(placement, { item: updated, action: 'updated' });

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

      if (!multi) {
        list = list.map(p => (p.id === id ? { ...p, active } : { ...p, active: false }));
      } else {
        list = [...list.slice(0, index), { ...popup, active }, ...list.slice(index + 1)];
        list = list.map(p => (p.placementSettings?.[placementKey]?.multi === false ? { ...p, active: false } : p));
      }

      this.store[placementKey] = list;
      this.touch(placementKey, { item: popup, action: 'active', value: active });

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
    this.touch(placement, {
      item: list,
      action: 'activeMany',
      value: list.reduce((acum, popup) => ({ ...acum, [popup.id]: popup.active }), {})
    });

    return true;
  }

  clear(placement?: P): void {
    if (placement) {
      this.assertPlacement(placement);

      const popupIds = this.store[placement].map(p => p.id);
      this.popupsAddedManually = this.popupsAddedManually.filter(popupId => !popupIds.includes(popupId));
      const prevList = this.store[placement];
      this.store[placement] = [];
      this.touch(placement, { item: prevList, action: 'removed' });

      return;
    }

    this.popupsAddedManually = [];
    for (const p in this.store) {
      const prevList = this.store[p];
      this.store[p] = [];
      this.touch(p, { item: prevList, action: 'removed' });
    }
  }
}

export default PopupManager;
