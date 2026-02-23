import { produce } from 'immer';

import { get } from '@/helpers/lodash';
import { isInViewport } from '@/helpers/utils';

import type { TreeProps } from './Tree';
import type { ReactNode } from 'react';

export type TreeItem = {
  id: string;
  icon?: ReactNode;
  label: string;
  items?: TreeItem[];
};

export type TreeFlatItems = { [key: string]: TreeFlatItem | undefined };

export type TreeFlatItem = Omit<TreeItem, 'items'> & {
  level: number;
  path: string;
  parentId?: string;
  items?: string[];
};

export type DragMetadata = {
  isDragging?: boolean;
  nodeId?: string;
  parentNodeId?: string;
  nodeHoveredId?: string;
  dropPosition?: DropPosition;
};

export type DropPosition = 'top' | 'bottom' | 'inside'; // | 'left' | 'right'

export const defaultDragMetadata = {
  isDragging: false,
  nodeHoveredId: '',
  dropPosition: undefined
};

export const DropDirectionConstants = {
  top: 'top',
  bottom: 'bottom',
  // left: 'left',
  // right: 'right',
  inside: 'inside'
};

export const getFlatItems = (items: TreeItem[], level: number = 0, parentId: string = '', path: string = '') => {
  let flatItems: TreeFlatItems = {};
  items.forEach((item: TreeItem, i) => {
    const { id, items: subItems } = item;
    const newItem = { ...item, level, parentId, path: path ? `${path}.${i}` : `${i}` } as TreeFlatItem;
    if (!subItems) {
      flatItems[id] = newItem;

      return;
    }

    newItem.items = subItems.map(subItem => subItem.id);
    flatItems = {
      ...flatItems,
      [id]: newItem,
      ...getFlatItems(subItems, level + 1, id, `${path ? `${path}.` : ''}${i}.items`)
    };
  });

  return flatItems;
};

export const setClosedMultiple = (id: string, flatItems: TreeFlatItems) => {
  let nodesToClose: { [key: string]: boolean } = {};
  const node = flatItems[id];
  if (!node?.items) {
    return nodesToClose;
  }

  nodesToClose[id] = false;
  const { items } = node;
  items.forEach((subNodeId: string) => {
    const subNode = flatItems[subNodeId];
    if (!subNode || !subNode.items) {
      return;
    }

    nodesToClose[id] = false;
    nodesToClose = { ...nodesToClose, ...setClosedMultiple(subNodeId, flatItems) };
  });

  return nodesToClose;
};

export const hasParentSelected = (id: string, idSelected: string, flatItems: TreeFlatItems): boolean => {
  if (!idSelected) {
    return false;
  }

  const node = flatItems[id];
  if (!node || !node.parentId) {
    return false;
  }

  if (node.parentId === idSelected) {
    return true;
  }

  return hasParentSelected(node.parentId, idSelected, flatItems);
};

export const setOpenedMultiple = (id: string, flatItems: TreeFlatItems) => {
  const nodesToOpen: { [key: string]: boolean } = {};
  let node = flatItems[id];
  while (node) {
    if (node.items) {
      nodesToOpen[node.id] = true;
    }

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

export const moveNode = (
  nodeId: string,
  toNodeId: string,
  dropPosition: DropPosition,
  items: TreeItem[],
  flatItems: TreeFlatItems
): TreeItem[] | undefined => {
  let swapped: boolean = false;
  const newItems = produce(items, draft => {
    const flatNode = flatItems[nodeId];
    const toFlatNode = flatItems[toNodeId];
    if (!flatNode || !flatNode.parentId || !toFlatNode) {
      return;
    }

    const parentFlatNode = flatItems[flatNode.parentId] as TreeFlatItem;
    const node = get(draft, flatNode.path) as TreeItem | undefined;
    const parentNode = get(draft, parentFlatNode.path) as TreeItem | undefined;
    if (!node || !parentNode) {
      return;
    }

    // Swap positions
    const toParentFlatNode = flatItems[toFlatNode.parentId ? toFlatNode.parentId : toNodeId];
    if (!toParentFlatNode) {
      return;
    }

    if (dropPosition === 'inside' && toNodeId !== flatNode.parentId) {
      const toItems = get<TreeItem[], string>(draft, `${toFlatNode.path}.items`) as TreeItem[] | undefined;
      if (toItems) {
        toItems.splice(toItems.length, 0, node);
        swapped = true;
      }
    } else if (dropPosition !== 'inside' && toFlatNode.parentId) {
      const toItems = get<TreeItem[], string>(draft, `${toParentFlatNode.path}.items`) as TreeItem[] | undefined;
      if (toItems) {
        toItems.splice(toItems.findIndex(item => item.id === toNodeId) + (dropPosition === 'top' ? 0 : 1), 0, node);
        swapped = true;
      }
    }

    if (swapped) {
      parentNode.items = parentNode.items?.filter(item => item.id !== nodeId);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!swapped) {
    return undefined;
  }

  return newItems;
};

export const getPaddingLeft = (level: number, size: TreeProps['size']) => {
  switch (size) {
    case 'sm':
      return level * 12;
    case 'xs':
      return level * 8;
    case 'md':
    default:
      return level * 16;
  }
};
