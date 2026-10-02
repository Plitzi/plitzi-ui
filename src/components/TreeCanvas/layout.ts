export type TreeCanvasItem<T> = {
  id: string;
  data: T;
  children?: TreeCanvasItem<T>[];
  /** Whether other items may be dropped into it. */
  container?: boolean;
};

export type TreeCanvasLayoutOptions = {
  nodeWidth: number;
  nodeHeight: number;
  /** Between siblings side by side. */
  gapX: number;
  /** Between a parent and its children. */
  gapY: number;
  /** Between leaves stacked in a column. */
  gapStack?: number;
  /** How many leaves one column holds before another starts beside it. */
  columnSize?: number;
  /** Items whose children are folded away: they keep their place, and nothing is drawn under them. */
  collapsed?: ReadonlySet<string>;
};

export type LaidOutNode<T> = {
  item: TreeCanvasItem<T>;
  parentId: string | null;
  depth: number;
  x: number;
  y: number;
  /** Its children, drawn or folded away. */
  childCount: number;
  collapsed: boolean;
};

export type LaidOutEdge = { id: string; from: string; to: string; path: string };

export type TreeCanvasLayout<T> = {
  nodes: LaidOutNode<T>[];
  edges: LaidOutEdge[];
  width: number;
  height: number;
};

const EDGE_RADIUS = 8;
// A column of leaves hangs off a trunk this far in from its left edge, the leaves twice as far.
const TRUNK_INSET = 16;
const COLUMN_INDENT = TRUNK_INSET * 2;

const corner = (radius: number, from: number, to: number) => Math.min(radius, Math.abs(to - from) / 2);

/**
 * A right-angled connector from a parent's bottom to a child's top, its corners rounded — the step every org chart
 * draws, straight down when the child sits under its parent.
 */
const stepPath = (fromX: number, fromY: number, toX: number, toY: number): string => {
  if (fromX === toX) {
    return `M ${fromX} ${fromY} V ${toY}`;
  }

  const midY = (fromY + toY) / 2;
  const direction = toX > fromX ? 1 : -1;
  const radius = Math.min(corner(EDGE_RADIUS, fromX, toX), (toY - fromY) / 4);

  return [
    `M ${fromX} ${fromY}`,
    `V ${midY - radius}`,
    `Q ${fromX} ${midY} ${fromX + direction * radius} ${midY}`,
    `H ${toX - direction * radius}`,
    `Q ${toX} ${midY} ${toX} ${midY + radius}`,
    `V ${toY}`
  ].join(' ');
};

/**
 * From a parent's bottom to a leaf in a column: down to the gap, along it to the column's trunk, down the trunk, and in
 * to the leaf's left side. Leaves of one column share every segment but their last.
 */
const trunkPath = (fromX: number, fromY: number, midY: number, trunkX: number, toX: number, toY: number): string => {
  const radius = Math.min(EDGE_RADIUS, (toY - midY) / 2, (midY - fromY) / 2);
  const parts = [`M ${fromX} ${fromY}`];
  if (fromX === trunkX) {
    parts.push(`V ${toY - radius}`);
  } else {
    const direction = trunkX > fromX ? 1 : -1;
    const r = Math.min(radius, corner(EDGE_RADIUS, fromX, trunkX));
    parts.push(
      `V ${midY - r}`,
      `Q ${fromX} ${midY} ${fromX + direction * r} ${midY}`,
      `H ${trunkX - direction * r}`,
      `Q ${trunkX} ${midY} ${trunkX} ${midY + r}`,
      `V ${toY - radius}`
    );
  }

  parts.push(`Q ${trunkX} ${toY} ${trunkX + radius} ${toY}`, `H ${toX}`);

  return parts.join(' ');
};

// A folded item is still a branch: folding it must not move it from the row of branches into a column of leaves.
const isLeaf = <T>(item: TreeCanvasItem<T>) => (item.children ?? []).length === 0;

/**
 * Where every item of a forest sits — the way a sitemap is drawn: the items that hold others side by side, each centred
 * over what it holds; the leaves stacked in columns under their parent, so forty pages in one folder read as a block, not
 * as a row nobody can zoom out far enough to see. The top level follows the same rule. Positions are the top-left
 * corner of each node, in canvas units.
 */
export const layoutTree = <T>(items: TreeCanvasItem<T>[], options: TreeCanvasLayoutOptions): TreeCanvasLayout<T> => {
  const { nodeWidth, nodeHeight, gapX, gapY, gapStack = 16, columnSize = 6, collapsed } = options;
  const shown = (item: TreeCanvasItem<T>) => (collapsed?.has(item.id) ? [] : (item.children ?? []));
  const columnWidth = COLUMN_INDENT + nodeWidth;
  const rowStep = nodeHeight + gapStack;

  const split = (children: TreeCanvasItem<T>[]) => ({
    leaves: children.filter(isLeaf),
    branches: children.filter(child => !isLeaf(child))
  });

  const columnsOf = (leaves: number) => Math.ceil(leaves / columnSize);

  /** How wide the block of a set of children is: its columns of leaves, then its branches. */
  const contentWidth = (children: TreeCanvasItem<T>[]): number => {
    const { leaves, branches } = split(children);
    const columns = columnsOf(leaves.length);
    const leavesWidth = columns * columnWidth + Math.max(0, columns - 1) * gapX;
    const branchesWidth =
      branches.reduce((sum, branch) => sum + measure(branch), 0) + gapX * Math.max(0, branches.length - 1);

    return leavesWidth + (leavesWidth && branchesWidth ? gapX : 0) + branchesWidth;
  };

  const widths = new Map<string, number>();
  const measure = (item: TreeCanvasItem<T>): number => {
    const cached = widths.get(item.id);
    if (cached !== undefined) {
      return cached;
    }

    const width = Math.max(nodeWidth, contentWidth(shown(item)));
    widths.set(item.id, width);

    return width;
  };

  const nodes: LaidOutNode<T>[] = [];
  const edges: LaidOutEdge[] = [];
  let height = 0;

  const add = (node: LaidOutNode<T>) => {
    nodes.push(node);
    height = Math.max(height, node.y + nodeHeight);
  };

  /** Lays out a set of children from `left`, a row below `parent` — or as the top level when there is none. */
  const placeChildren = (
    children: TreeCanvasItem<T>[],
    left: number,
    top: number,
    depth: number,
    parent: LaidOutNode<T> | null
  ) => {
    const { leaves, branches } = split(children);
    let x = left;
    const parentCenter = parent ? parent.x + nodeWidth / 2 : 0;
    const parentBottom = parent ? parent.y + nodeHeight : 0;
    const midY = top - gapY / 2;

    for (let column = 0; column < columnsOf(leaves.length); column++) {
      const trunkX = x + TRUNK_INSET;
      leaves.slice(column * columnSize, (column + 1) * columnSize).forEach((leaf, row) => {
        const node: LaidOutNode<T> = {
          item: leaf,
          parentId: parent?.item.id ?? null,
          depth,
          x: x + COLUMN_INDENT,
          y: top + row * rowStep,
          childCount: 0,
          collapsed: false
        };
        add(node);
        if (parent) {
          edges.push({
            id: `${parent.item.id}->${leaf.id}`,
            from: parent.item.id,
            to: leaf.id,
            path: trunkPath(parentCenter, parentBottom, midY, trunkX, node.x, node.y + nodeHeight / 2)
          });
        }
      });
      x += columnWidth + gapX;
    }

    for (const branch of branches) {
      const width = measure(branch);
      const node: LaidOutNode<T> = {
        item: branch,
        parentId: parent?.item.id ?? null,
        depth,
        x: x + (width - nodeWidth) / 2,
        y: top,
        childCount: (branch.children ?? []).length,
        collapsed: collapsed?.has(branch.id) ?? false
      };
      add(node);
      if (parent) {
        edges.push({
          id: `${parent.item.id}->${branch.id}`,
          from: parent.item.id,
          to: branch.id,
          path: stepPath(parentCenter, parentBottom, node.x + nodeWidth / 2, node.y)
        });
      }

      const children = shown(branch);
      const inner = contentWidth(children);
      placeChildren(children, x + (width - inner) / 2, top + nodeHeight + gapY, depth + 1, node);
      x += width + gapX;
    }
  };

  placeChildren(items, 0, 0, 0, null);

  return { nodes, edges, width: contentWidth(items), height };
};

/** Whether `candidate` is `ancestor` itself or somewhere under it — never a place to drop `ancestor` into. */
export const isWithin = <T>(items: TreeCanvasItem<T>[], ancestor: string, candidate: string): boolean => {
  const find = (list: TreeCanvasItem<T>[]): TreeCanvasItem<T> | undefined => {
    for (const item of list) {
      if (item.id === ancestor) {
        return item;
      }

      const found = find(item.children ?? []);
      if (found) {
        return found;
      }
    }

    return undefined;
  };

  const contains = (item: TreeCanvasItem<T>): boolean =>
    item.id === candidate || (item.children ?? []).some(child => contains(child));

  const root = find(items);

  return root ? contains(root) : false;
};
