import type { RefObject } from 'react';

type Panel = {
  id: string;
  ref: RefObject<HTMLElement | null>;
  active: boolean;
  hasManualSize: boolean;
  minSize: number;
  maxSize?: number;
};

type AccordionUpdateListener = (timestamp: number) => void;

type StyleProps = {
  [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[K] extends string ? K : never]?: string;
};

export type AccordionManagerOptions = {
  multi?: boolean;
  defaultActive?: string[];
  alwaysOpen?: boolean;
};

class AccordionManager {
  private containerRef: RefObject<HTMLElement | null>;
  private panels: Panel[] = [];
  private dragging = false;
  private settings: { multi: boolean; alwaysOpen: boolean; defaultActive: string[] };
  lastUpdate: number;
  lastUpdateActive: number;
  private listeners = new Set<AccordionUpdateListener>();

  private draggingData: {
    startY: number;
    panelA: Panel;
    startA: number;
    panelB: Panel;
    startB: number;
    hasManualSizeB: boolean;
  } | null = null;

  constructor(containerRef: RefObject<HTMLElement | null>, options?: AccordionManagerOptions) {
    this.containerRef = containerRef;
    const { multi = false, alwaysOpen = true, defaultActive = [] } = options ?? {};
    this.settings = { multi, alwaysOpen, defaultActive };
    this.lastUpdate = Date.now();
    this.lastUpdateActive = Date.now();
  }

  // Layout

  resyncLayout() {
    let hasActive = false;
    for (let i = this.panels.length - 1; i >= 0; i--) {
      const panel = this.panels[i];
      if (panel.hasManualSize && panel.active) {
        this.updateDOMStyles(panel.ref.current, { flexGrow: '', flexBasis: '' });
        panel.hasManualSize = false;

        break;
      } else if (panel.active) {
        // at least one of them is not manual, so is auto-size
        hasActive = true;

        break;
      }
    }

    if (!hasActive && this.settings.alwaysOpen && this.panels.length) {
      this.panels[0].active = true;
    }
  }

  // Panel Methods

  register(id: string, ref: RefObject<HTMLElement | null>, settings?: { minSize?: number; maxSize?: number }) {
    if (!ref.current || this.get(id)) {
      return;
    }

    let active = this.settings.defaultActive.includes(id);
    const activeCount = this.getActives().length;
    if (!this.settings.multi && activeCount) {
      active = false;
    } else if (!activeCount && this.settings.alwaysOpen) {
      active = true;
    }

    const hasManualSize = !!ref.current.style.flexBasis && ref.current.style.flexBasis !== 'auto';
    const { minSize = 80, maxSize = Infinity } = settings ?? {};
    this.resyncLayout();
    this.panels.push({ id, ref, active, hasManualSize, minSize, maxSize });
    this.panels = this.sortPanels(this.panels);
    this.touch();
  }

  unregister(id: string) {
    this.panels = this.panels.filter(p => p.id !== id);
    this.resyncLayout();
    this.touch();
  }

  get(): Panel[];
  get(id: string): Panel | undefined;
  get(id?: string) {
    if (id === undefined) {
      return this.panels;
    }

    return this.panels.find(p => p.id === id);
  }

  getActives(): Panel[] {
    return this.panels.filter(p => p.active);
  }

  getIndex(id: string) {
    return this.panels.findIndex(p => p.id === id);
  }

  isOpen(id: string) {
    return this.get(id)?.active ?? false;
  }

  toggle(id: string) {
    const index = this.getIndex(id);
    if (index === -1) {
      return;
    }

    const panel = this.panels[index];
    const newActive = !panel.active;
    if (!newActive && this.settings.alwaysOpen && this.getActives().length === 1) {
      return;
    }

    if (!newActive && panel.hasManualSize) {
      this.updateDOMStyles(panel.ref.current, { flexGrow: '', flexBasis: '' });
      panel.hasManualSize = false;
    }

    panel.active = newActive;
    let panelsActive = this.getActives();
    if (!this.settings.multi && panelsActive.length > 1) {
      panelsActive.filter(p => p.id !== id).forEach(panel => (panel.active = false));
      panelsActive = this.getActives();
    }

    if (panelsActive.length === 1) {
      const panelsWithSize = this.panels.filter(p => p.hasManualSize);
      if (panelsWithSize.length) {
        panelsWithSize.forEach(panel => {
          this.updateDOMStyles(panel.ref.current, { flexGrow: '', flexBasis: '' });
          panel.hasManualSize = false;
        });
      }
    }

    this.touch(true);
  }

  canResize(id: string) {
    const index = this.getIndex(id);
    if (index === -1 || !this.panels[index].active || index === this.panels.length - 1) {
      return false;
    }

    const nextActive = this.panels[index + 1]?.active;
    const activeIds = this.getActives().map(p => p.id);

    return nextActive || this.panels.find((i, pos) => activeIds.includes(i.id) && i.id !== id && pos > index);
  }

  onResizeStart = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const index = this.panels.findIndex(p => p.id === id);
    if (
      index === -1 ||
      index === this.panels.length - 1 ||
      !this.containerRef.current ||
      this.panels.filter(p => p.active).length <= 1
    ) {
      return;
    }

    const panelA = this.panels[index];
    let panelB = this.panels[index + 1] as Panel | undefined;
    const panelsActive = this.getActives();
    if (!panelB?.active) {
      panelB = this.panels.find((p, i) => p.active && p.id !== panelA.id && i > index);
    }

    if (!panelB) {
      return;
    }

    const startA = panelA.ref.current?.offsetHeight ?? 0;
    const startB = panelB.ref.current?.offsetHeight ?? 0;
    let deltaA = 0;
    if (startA < panelA.minSize) {
      deltaA = Math.abs(startA - panelA.minSize);
    }

    const hasManualSizeB = panelsActive[panelsActive.length - 1].id !== panelB.id;

    this.draggingData = {
      startY: e.clientY + deltaA / 2,
      panelA,
      startA: startA + deltaA,
      panelB,
      startB,
      hasManualSizeB
    };
    this.updateDOMStyles(this.containerRef.current, { userSelect: 'none', cursor: 'row-resize' });
    this.updateDOMStyles(panelA.ref.current, { flexBasis: `${startA + deltaA}px`, flexGrow: '0' });
    if (hasManualSizeB) {
      this.updateDOMStyles(panelB.ref.current, { flexBasis: `${startB}px`, flexGrow: '0' });
    }

    this.startDragging();
  };

  // Mouse Events

  private onMouseMove = (e: MouseEvent) => {
    if (!this.draggingData) {
      return;
    }

    const container = this.containerRef.current;
    if (!container) {
      return;
    }

    const { startY, panelA, startA, panelB, startB, hasManualSizeB } = this.draggingData;
    const delta = e.clientY - startY;
    const newA = startA + delta;
    const newB = startB - delta;

    if (newA < panelA.minSize || newB < panelB.minSize) {
      return;
    }

    panelA.hasManualSize = true;
    this.updateDOMStyles(panelA.ref.current, { flexBasis: `${newA}px` });
    if (hasManualSizeB) {
      panelB.hasManualSize = true;
      this.updateDOMStyles(panelB.ref.current, { flexBasis: `${newB}px` });
    }
  };

  private onMouseUp = () => {
    this.stopDragging();
  };

  // Dragging Methods

  private startDragging() {
    if (this.dragging) {
      return;
    }

    this.dragging = true;
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  private stopDragging() {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.updateDOMStyles(this.containerRef.current, { userSelect: '', cursor: '' });
    this.draggingData = null;
  }

  // Other Methods

  private sortPanels(items: Panel[]) {
    return items.slice().sort((a, b) => {
      if (a.ref.current === b.ref.current || !a.ref.current || !b.ref.current) {
        return 0;
      }

      return a.ref.current.compareDocumentPosition(b.ref.current) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }

  private updateDOMStyles(el: HTMLElement | null, css: StyleProps) {
    if (!el) {
      return;
    }

    for (const key in css) {
      el.style[key] = css[key] !== undefined ? css[key] : '';
    }
  }

  onUpdate(listener: AccordionUpdateListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private touch(active: boolean = false): void {
    const ts = Date.now();
    this.lastUpdate = ts;
    for (const listener of this.listeners) {
      listener(ts);
    }

    if (active) {
      this.lastUpdateActive = ts;
    }
  }
}

export default AccordionManager;
