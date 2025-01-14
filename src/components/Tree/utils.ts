// Alias
import { isInViewport } from '@/helpers/utils';

export type TreeItemBase = {
  id: string;
  label: string;
  isParent: boolean;
  parentId?: string;
};

export type TreeItemParent = TreeItemBase & {
  isParent: true;
  items: TreeItem[];
};

export type TreeItemChild = TreeItemBase & {
  isParent: false;
};

export type TreeItem = TreeItemParent | TreeItemChild;

export type TreeFlatItems = { [key: string]: TreeFlatItem };

export type TreeFlatItem = TreeItemBase & {
  level: number;
  path: string;
  parentId?: string;
} & ({ isParent: true; items: string[] } | TreeItemChild);

export type DragMetadata = {
  isDragging?: boolean;
  nodeId?: string;
  parentNodeId?: string;
  nodeHoveredId?: string;
  dropPosition?: DropPosition;
};

export type DropPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside';

export const defaultDragMetadata = {
  isDragging: false,
  nodeHoveredId: '',
  dropPosition: undefined
};

export const DropDirectionConstants = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  inside: 'inside'
};

export const getFlatItems = (items: TreeItem[], level: number = 0, parentId: string = '', path: string = '') => {
  let flatItems: TreeFlatItems = {};
  items.forEach((item: TreeItem, i) => {
    const { id, isParent } = item;
    const newItem = { ...item, level, parentId, path: path ? `${path}.${i}` : `${i}` } as TreeFlatItem;
    if (!isParent || !newItem.isParent) {
      flatItems[id] = newItem;

      return;
    }

    const { items: subItems } = item;
    newItem.items = subItems.map(subItem => subItem.id);
    path = `${path ? `${path}.` : ''}${i}.items`;
    flatItems = { ...flatItems, [id]: newItem, ...getFlatItems(subItems, level + 1, id, path) };
  });

  return flatItems;
};

export const setOpenedMultiple = (id: string, flatItems: TreeFlatItems, areOpening = true) => {
  const nodesToOpen: { [key: string]: boolean } = {};
  let node = flatItems[id] as TreeFlatItem | undefined;
  while (node) {
    nodesToOpen[node.id] = areOpening;
    if (!node.parentId) {
      break;
    }

    node = flatItems[node.parentId];
  }

  if (Object.keys(nodesToOpen).length === 0) {
    const elementDOM = window.document.querySelector(`[data-id="${id}"]`) as HTMLElement | undefined;
    if (elementDOM && !isInViewport(elementDOM)) {
      const { offsetParent, offsetTop } = elementDOM;
      if (offsetParent) {
        offsetParent.scrollTop = offsetTop;
      }
    }

    return nodesToOpen;
  }

  const elementDOM = window.document.querySelector(`[data-id="${id}"]`) as HTMLElement | undefined;
  if (elementDOM && !isInViewport(elementDOM)) {
    const { offsetParent, offsetTop } = elementDOM;
    if (offsetParent) {
      offsetParent.scrollTop = offsetTop;
    }
  }

  return nodesToOpen;
};
