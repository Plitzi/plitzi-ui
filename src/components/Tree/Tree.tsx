import { produce } from 'immer';
import get from 'lodash/get.js';
import set from 'lodash/set.js';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import useTheme from '@hooks/useTheme';

import TreeNode from './TreeNode';
import {
  defaultDragMetadata,
  getFlatItems,
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
import type { DragEvent, ReactNode } from 'react';

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
} & useThemeSharedProps<typeof TreeStyles, typeof variantKeys>;

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
  isDragAllowed
}: TreeProps) => {
  className = useTheme<typeof TreeStyles, typeof variantKeys>('Tree', {
    className,
    componentKey: 'root',
    variants: { intent, size }
  });
  const dragMetadata = useRef<DragMetadata>(defaultDragMetadata);
  const flatItems = useMemo(() => getFlatItems(items), [items]);
  const itemsFiltered = useMemo(
    () =>
      Object.values(flatItems).filter(
        (item): item is TreeFlatItem => !!item && (!item.parentId || !!itemsOpened?.[item.parentId])
      ),
    [flatItems, itemsOpened]
  );

  const handleItemChange = useCallback(
    (id: string, label: string) => {
      const node = flatItems[id];
      if (!node) {
        return;
      }

      const newItems = produce(items, draft => {
        set(draft, `${node.path}.label`, label);
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

  return (
    <div
      className={className}
      tabIndex={-1}
      data-testid={testId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {itemsFiltered.map(item => {
        const { id, label, level, parentId, icon = 'fa-solid fa-shapes' } = item;

        return (
          <TreeNode
            key={id}
            id={id}
            parentNodeId={parentId}
            label={label}
            level={level}
            isOpen={itemsOpened?.[id]}
            isParent={!!item.items}
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
          >
            {/* {icon && typeof icon === 'string' && !icon.startsWith('http') && (
              <TreeNode.Icon icon={icon} intent="custom" size={size} />
            )}
            {icon && typeof icon === 'string' && icon.startsWith('http') && (
              <TreeNode.Icon intent="custom" size={size}>
                <img src={icon} />
              </TreeNode.Icon>
            )}
            {icon && typeof icon !== 'string' && icon} */}
          </TreeNode>
        );
      })}
    </div>
  );
};

export default Tree;
