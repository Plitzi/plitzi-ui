import clsx from 'clsx';
import { produce } from 'immer';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { get, set } from '@/helpers/lodash';
import useTheme from '@hooks/useTheme';

import TreeNode from './TreeNode';
import {
  defaultDragMetadata,
  getFlatItems,
  hasChildren,
  hasParentSelected,
  moveNode,
  setClosedMultiple,
  setOpenedMultiple
} from './utils';

import type TreeStyles from './Tree.styles';
import type { variantKeys } from './Tree.styles';
import type { ItemControlsProps } from './TreeNode';
import type { DragMetadata, DropPosition, TreeFlatItem, TreeItem } from './utils';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { DragEvent, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export type { TreeItem, ItemControlsProps, DropPosition };

export type TreeChangeState =
  | { action: 'itemsChange'; data: TreeItem[] }
  | { action: 'itemsOpened'; data: { [key: string]: boolean } }
  | { action: 'itemChanged'; data: { items: TreeItem[]; item: TreeItem } }
  | { action: 'itemHovered'; data: string | undefined }
  | {
      action: 'itemDragged';
      data: { id: string; toId: string; dropPosition: DropPosition; items: TreeItem[]; event: DragEvent };
    }
  | { action: 'externalItemDragged'; data: { toId: string; dropPosition: DropPosition; event: DragEvent } }
  | { action: 'itemSelected'; data: string | undefined }
  | { action: 'isDragging'; data: boolean };

export type TreeProps = {
  itemControls?: ReactNode;
  testId?: string;
  itemsOpened?: { [key: string]: boolean };
  itemHovered?: string;
  itemSelected?: string;
  items: TreeItem[];
  onChange?: (state: TreeChangeState) => void;
  isDragAllowed?: (id: string, dropPosition: DropPosition, parentId?: string) => boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> &
  useThemeSharedProps<typeof TreeStyles, typeof variantKeys>;

const Tree = ({
  itemControls,
  testId,
  className,
  items = [],
  itemsOpened,
  itemHovered,
  itemSelected,
  intent,
  size,
  onChange,
  isDragAllowed,
  ...divProps
}: TreeProps) => {
  className = useTheme<typeof TreeStyles, typeof variantKeys>('Tree', {
    className,
    componentKey: 'root',
    variants: { intent, size }
  });
  const dragMetadata = useRef<DragMetadata>(defaultDragMetadata);
  const flatItems = useMemo(() => getFlatItems(items), [items]);
  // A row shows while every ancestor is open, not only its parent: a branch closed higher up hides all of it, even the
  // parts of it that were left open inside.
  const itemsFiltered = useMemo(
    () =>
      Object.values(flatItems).filter((item): item is TreeFlatItem => {
        if (!item) {
          return false;
        }

        for (let parentId = item.parentId; parentId; parentId = flatItems[parentId]?.parentId) {
          if (!itemsOpened?.[parentId]) {
            return false;
          }
        }

        return true;
      }),
    [flatItems, itemsOpened]
  );

  const handleItemChange = useCallback(
    (id: string, label: string) => {
      const node = flatItems[id];
      if (!node) {
        return;
      }

      const newItems = produce(items, draft => {
        set(draft as typeof items, `${node.path}.label`, label);
      });

      onChange?.({ action: 'itemChanged', data: { items: newItems, item: get(newItems, node.path) as TreeItem } });
    },
    [flatItems, items, onChange]
  );

  const handleHover = useCallback((nodeId?: string) => onChange?.({ action: 'itemHovered', data: nodeId }), [onChange]);

  const handleSelect = useCallback(
    (nodeId?: string) => onChange?.({ action: 'itemSelected', data: nodeId }),
    [onChange]
  );

  const setOpened = useCallback(
    (nodeId: string, opened: boolean) => {
      let newItemsOpened;
      if (!opened) {
        newItemsOpened = { ...itemsOpened, ...setClosedMultiple(nodeId, flatItems) };
      } else {
        newItemsOpened = { ...itemsOpened, [nodeId]: opened };
      }

      onChange?.({ action: 'itemsOpened', data: newItemsOpened });
      if (!opened && itemSelected) {
        const nodeSelected = flatItems[itemSelected];
        if (nodeSelected && nodeSelected.parentId && !newItemsOpened[nodeSelected.parentId]) {
          onChange?.({ action: 'itemSelected', data: undefined });
        }
      }
    },
    [flatItems, onChange, itemsOpened, itemSelected]
  );

  useEffect(() => {
    if (!itemSelected) {
      return;
    }

    const node = flatItems[itemSelected];
    if (!node) {
      return;
    }

    if ((node.items && !itemsOpened?.[node.id]) || (node.parentId && !itemsOpened?.[node.parentId])) {
      onChange?.({ action: 'itemsOpened', data: { ...itemsOpened, ...setOpenedMultiple(itemSelected, flatItems) } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSelected]);

  const setDragMetadata = useCallback((metadata: DragMetadata, append = true) => {
    if (append) {
      dragMetadata.current = { ...dragMetadata.current, ...metadata };

      return;
    }

    dragMetadata.current = metadata;
  }, []);

  const resetDragMetadata = useCallback(() => {
    dragMetadata.current = defaultDragMetadata;
  }, []);

  const getDragMetadata = useCallback(() => dragMetadata.current, []);

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      e.stopPropagation();
      onChange?.({ action: 'isDragging', data: true });
    },
    [onChange]
  );

  const handleDragEnd = useCallback(
    (e: DragEvent) => {
      e.stopPropagation();
      onChange?.({ action: 'isDragging', data: false });
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent, id: string, toId: string, dropPosition: DropPosition) => {
      const newItems = moveNode(id, toId, dropPosition, items, flatItems);
      if (newItems && id) {
        onChange?.({ action: 'itemDragged', data: { id, toId, dropPosition, items: newItems, event: e } });
      } else {
        onChange?.({ action: 'externalItemDragged', data: { toId, dropPosition, event: e } });
      }
    },
    [flatItems, items, onChange]
  );

  /**
   * The tree as the keyboard moves through it, over the rows it shows: up and down a row, right into a branch (opening
   * it first), left out of one (closing it first), Home and End to the ends. A key typed into a label being renamed is
   * the label's.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const target = e.target instanceof HTMLElement ? e.target : undefined;
      if (target?.isContentEditable || target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        return;
      }

      const index = itemsFiltered.findIndex(item => item.id === itemSelected);
      const current = index === -1 ? undefined : itemsFiltered[index];
      let next: string | undefined;
      switch (e.key) {
        case 'ArrowDown':
          next = itemsFiltered[index === -1 ? 0 : Math.min(index + 1, itemsFiltered.length - 1)]?.id;
          break;
        case 'ArrowUp':
          next = itemsFiltered[index === -1 ? 0 : Math.max(index - 1, 0)]?.id;
          break;
        case 'Home':
          next = itemsFiltered.at(0)?.id;
          break;
        case 'End':
          next = itemsFiltered.at(-1)?.id;
          break;
        case 'ArrowRight':
          if (current && hasChildren(current) && !itemsOpened?.[current.id]) {
            setOpened(current.id, true);
          } else if (current) {
            next = itemsFiltered.find(item => item.parentId === current.id)?.id;
          }
          break;
        case 'ArrowLeft':
          if (current && hasChildren(current) && itemsOpened?.[current.id]) {
            setOpened(current.id, false);
          } else if (current?.parentId) {
            next = current.parentId;
          }
          break;
        default:
          return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (next && next !== itemSelected) {
        handleSelect(next);
      }
    },
    [handleSelect, itemSelected, itemsFiltered, itemsOpened, setOpened]
  );

  return (
    <div
      className={clsx('tree focus-visible:outline-none', className)}
      role="tree"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      {...divProps}
    >
      {itemsFiltered.map((item, i) => {
        const { id, label, hint, level, parentId, icon = 'fa-solid fa-shapes' } = item;

        return (
          <TreeNode
            key={`${i}-${id}`}
            id={id}
            parentNodeId={parentId}
            label={label}
            hint={hint}
            level={level}
            isOpen={itemsOpened?.[id]}
            isParent={hasChildren(item)}
            canDragDrop={!!parentId}
            setOpened={setOpened}
            hovered={itemHovered === id}
            parentSelected={!!itemSelected && hasParentSelected(id, itemSelected, flatItems)}
            selected={itemSelected === id}
            intent={intent}
            size={size}
            controls={itemControls}
            icon={icon}
            setDragMetadata={setDragMetadata}
            resetDragMetadata={resetDragMetadata}
            getDragMetadata={getDragMetadata}
            onHover={handleHover}
            onSelect={handleSelect}
            onDrop={handleDrop}
            onChange={handleItemChange}
            isDragAllowed={isDragAllowed}
          />
        );
      })}
    </div>
  );
};

export default Tree;
