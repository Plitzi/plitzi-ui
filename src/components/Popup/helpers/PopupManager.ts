import type { PopupPlacement } from '../Popup';
import type { PopupInstance } from '../PopupProvider';

type PopupStore<P extends PopupPlacement> = {
  [K in P]: PopupInstance[];
};

export class PopupManager<P extends PopupPlacement> {
  private store: PopupStore<P>;
  private lastUpdate: Record<P, number>;

  constructor(placements: readonly P[], popups?: Partial<PopupStore<P>>) {
    this.store = {} as PopupStore<P>;
    this.lastUpdate = {} as Record<P, number>;

    for (const placement of placements) {
      this.store[placement] = this.sortByPosition(popups?.[placement] ?? [], placement);
      this.lastUpdate[placement] = Date.now();
    }
  }

  /* ---------- helpers ---------- */

  private sortByPosition(list: PopupInstance[], placement?: P): PopupInstance[] {
    const isFloating = placement === ('floating' as P);

    return list
      .map((popup, index) => ({ popup, index }))
      .sort((a, b) => {
        const pa = a.popup.position;
        const pb = b.popup.position;

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

  private touch(placement: P): void {
    this.lastUpdate[placement] = Date.now();
  }

  /* ---------- public API ---------- */

  getAll(): PopupStore<P> {
    return structuredClone(this.store);
  }

  /* ---------- get overloads ---------- */
  get(placement: P): PopupInstance[];
  get(placement: P, popupId: string): PopupInstance | undefined;
  get(placement: P, popupId?: string): PopupInstance[] | PopupInstance | undefined {
    this.assertPlacement(placement);

    if (popupId !== undefined) {
      return this.store[placement].find(popup => popup.id === popupId);
    }

    return [...this.store[placement]];
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

    this.store[placement] = this.sortByPosition([...this.store[placement], popup], placement);
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
    if (this.store[to].some(popup => popup.id === id)) {
      return false;
    }

    for (const placement in this.store) {
      const from = placement as P;
      const index = this.store[from].findIndex(p => p.id === id);

      if (index !== -1) {
        const popup = this.store[from][index];

        // remove from current placement
        this.store[from] = this.store[from].filter(p => p.id !== id);

        // add to target placement
        this.store[to] = this.sortByPosition([...this.store[to], popup], to);

        this.touch(from);
        this.touch(to);

        return true;
      }
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
