// Packages
import { produce } from 'immer';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo, useRef } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import TreeNode from './TreeNode';
import { defaultDragMetadata, getFlatItems, setOpenedMultiple } from './utils';

// Types
import type TreeStyles from './Tree.styles';
import type { variantKeys } from './Tree.styles';
import type { DragMetadata, TreeFlatItem, TreeItem } from './utils';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type { TreeItem };

export type TreeChangeState =
  | { action: 'itemsChange'; data: TreeItem[] }
  | { action: 'itemChanged'; data: { items: TreeItem[]; item: TreeItem } }
  | { action: 'itemsOpened'; data: { [key: string]: boolean } }
  | { action: 'itemHovered'; data: string | undefined }
  | { action: 'itemSelected'; data: string | undefined };

export type TreeProps = {
  setDragTree?: (dragTree: boolean) => void;
  itemsOpened?: { [key: string]: boolean };
  itemHovered?: string;
  itemSelected?: string;
  items: TreeItem[];
  onChange?: (state: TreeChangeState['action'], data: TreeChangeState['data']) => void;
  onHover?: (value?: string) => void;
  onSelect?: (value?: string) => void;
} & useThemeSharedProps<typeof TreeStyles, typeof variantKeys>;

const Tree = ({
  className,
  setDragTree,
  items = [],
  itemsOpened,
  itemHovered,
  itemSelected,
  intent,
  size,
  onChange,
  onHover,
  onSelect
}: TreeProps) => {
  className = useTheme<typeof TreeStyles, typeof variantKeys>('Tree', {
    className,
    componentKey: 'root',
    variant: { intent, size }
  });
  const dragMetadata = useRef<DragMetadata>(defaultDragMetadata);
  const flatItems = useMemo(() => getFlatItems(items), [items]);
  const itemsFiltered = useMemo(
    () => Object.values(flatItems).filter(item => !item.parentId || itemsOpened?.[item.parentId]),
    [flatItems, itemsOpened]
  );

  const handleItemChange = useCallback(
    (id: string, label: string) => {
      const node = flatItems[id] as TreeFlatItem | undefined;
      if (!node) {
        return;
      }

      const newItems = produce(items, draft => {
        set(draft, `${node.path}.label`, label);
      });

      onChange?.('itemChanged', newItems);
    },
    [flatItems, items, onChange]
  );

  const handleHover = useCallback((nodeId?: string) => onHover?.(nodeId), [onHover]);

  const handleSelect = useCallback((nodeId?: string) => onSelect?.(nodeId), [onSelect]);

  const setOpened = useCallback(
    (nodeId: string, opened: boolean) => onChange?.('itemsOpened', { ...itemsOpened, [nodeId]: opened }),
    [onChange, itemsOpened]
  );

  useEffect(() => {
    if (itemSelected) {
      onChange?.('itemsOpened', setOpenedMultiple(itemSelected, flatItems));
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

  const handleDragOver = useCallback(() => setDragTree?.(true), [setDragTree]);

  return (
    <div className={className} tabIndex={-1} onDragOver={handleDragOver}>
      {itemsFiltered.map(item => {
        const { id, label, level, isParent, parentId } = item;

        return (
          <TreeNode
            key={id}
            id={id}
            parentNodeId={parentId}
            label={label}
            level={level}
            isOpen={itemsOpened?.[id]}
            isParent={isParent}
            canDragDrop={!!parentId}
            setOpened={setOpened}
            hovered={itemHovered === id}
            selected={itemSelected === id}
            setDragMetadata={setDragMetadata}
            resetDragMetadata={resetDragMetadata}
            getDragMetadata={getDragMetadata}
            onChange={handleItemChange}
            onHover={handleHover}
            onSelect={handleSelect}
          />
        );
      })}
    </div>
  );
};

export default Tree;
