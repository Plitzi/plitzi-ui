// Packages
import classNames from 'classnames';
import { Children, isValidElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Alias
import Contenteditable from '@components/ContentEditable';
import useTheme from '@hooks/useTheme';

// Relatives
import TreeNodeActions from './TreeNodeActions';

// Types
import type TreeStyles from './Tree.styles';
import type { variantKeys } from './Tree.styles';
import type { DragMetadata, DropPosition } from './utils';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { DragEvent, MouseEvent, ReactNode } from 'react';

const treeNodePadding = 16;

export type TreeNodeProps = {
  children?: ReactNode;
  className?: string;
  id?: string;
  parentNodeId?: string;
  level?: number;
  isOpen?: boolean;
  isParent?: boolean;
  hovered?: boolean;
  selected?: boolean;
  canDragDrop?: boolean;
  label?: string;
  setOpened?: (id: string, isOpen: boolean) => void;
  setDragMetadata?: (metadata: DragMetadata) => void;
  getDragMetadata?: () => DragMetadata;
  resetDragMetadata?: () => void;
  isDragAllowed?: (id: string, dropPosition: DropPosition) => boolean;
  onChange?: (id: string, value: string) => void;
  onHover?: (id?: string) => void;
  onSelect?: (id?: string) => void;
  onDrop?: (id: string, dropPosition: DropPosition) => void;
} & useThemeSharedProps<typeof TreeStyles, typeof variantKeys>;

const TreeNode = ({
  children,
  className = '',
  id = '',
  parentNodeId = '',
  level = 0,
  isOpen = false,
  isParent = false,
  hovered = false,
  selected = false,
  canDragDrop = true,
  label = '',
  setOpened,
  setDragMetadata,
  getDragMetadata,
  resetDragMetadata,
  isDragAllowed,
  onChange,
  onHover,
  onSelect,
  onDrop
}: TreeNodeProps) => {
  const [dragHovered, setDragHovered] = useState(false);
  className = useTheme<typeof TreeStyles, typeof variantKeys>('Tree', {
    className,
    componentKey: 'item',
    variant: { dragging: dragHovered, selected, hovered, parent: isParent }
  });
  const [dragAllowed, setDragAllowed] = useState(false);
  const [dropPosition, setDropPosition] = useState<DropPosition>();
  const clientRect = useRef<DOMRect | undefined>({} as DOMRect);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setOpened?.(id, !isOpen);
    },
    [id, isOpen, setOpened]
  );

  const handleClickSelect = useCallback(() => onSelect?.(id), [onSelect, id]);

  useEffect(() => {
    clientRect.current = ref.current?.getBoundingClientRect();
  }, []);

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      const offsetX = 0;
      const offsetY = 0;
      setDragMetadata?.({ isDragging: true, nodeId: id, parentNodeId, nodeHoveredId: '', dropPosition: undefined });
      onHover?.(undefined);
      onSelect?.(undefined);
      e.stopPropagation();
      e.dataTransfer.setDragImage(e.currentTarget, offsetX, offsetY);
    },
    [onHover, onSelect, setDragMetadata, id, parentNodeId]
  );

  const handleDragEnd = useCallback(() => {
    resetDragMetadata?.();
    setDragHovered(false);
    setDropPosition(undefined);
    setDragAllowed(true);
  }, [resetDragMetadata]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    const { nodeId, nodeHoveredId } = getDragMetadata?.() ?? ({} as DragMetadata);
    if (nodeId === id || !clientRect.current) {
      return;
    }

    const offsetY = e.clientY - clientRect.current.top - clientRect.current.height / 2;
    const offsetX = e.clientX - clientRect.current.left - treeNodePadding * 2;
    let newDropPosition: DropPosition;
    if ((offsetX > 0 && !!parentNodeId) || id === parentNodeId) {
      newDropPosition = 'inside';
    } else if (offsetY > 0) {
      newDropPosition = 'bottom';
    } else {
      newDropPosition = 'top';
    }

    if (nodeHoveredId !== id || dropPosition !== newDropPosition) {
      setDragMetadata?.({ nodeHoveredId: id, dropPosition: newDropPosition });
    }

    if (!dragHovered || dropPosition !== newDropPosition) {
      setDragHovered(true);
      setDropPosition(newDropPosition);
      setDragAllowed(isDragAllowed?.(id, newDropPosition) ?? false);
    }
  };

  const handleDragLeave = useCallback(() => {
    if (dragHovered) {
      setDragHovered(false);
      setDragAllowed(true);
      setDropPosition(undefined);
    }
  }, [dragHovered]);

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const { dropPosition } = getDragMetadata?.() ?? ({} as DragMetadata);
    setDragHovered(false);
    setDragAllowed(true);
    setDropPosition(undefined);
    resetDragMetadata?.();

    onDrop?.(id, dropPosition as DropPosition);
  };

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (hovered) {
        onHover?.(undefined);
      }
    },
    [hovered, onHover]
  );

  const handleHover = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (!hovered) {
        onHover?.(id);
      }
    },
    [hovered, id, onHover]
  );

  const handleChange = useCallback(
    (value: string) => {
      if (value !== label) {
        onChange?.(id, value);
      }
    },
    [id, label, onChange]
  );

  let paddingRight = level * treeNodePadding;
  if (!isParent) {
    paddingRight += 1;
  }

  const { actionsChildren } = useMemo(() => {
    const components: { actionsChildren: ReactNode } = { actionsChildren: undefined };
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === TreeNodeActions) {
        components.actionsChildren = child;
      }
    });

    return components;
  }, [children]);

  return (
    <div
      className={className}
      data-id={id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={canDragDrop}
      onMouseOver={handleHover}
      onMouseLeave={handleMouseLeave}
      onFocus={undefined}
      tabIndex={-1}
    >
      <div className="w-full flex" style={{ paddingLeft: `${paddingRight}px` }}>
        {isOpen && isParent && <div className="line" />}
        {isParent && (
          <div
            className={classNames('w-4 flex items-center cursor-pointer', {
              'node--open': isOpen
            })}
            onClick={handleClick}
          >
            {isOpen && <i className="fas fa-caret-down flex" />}
            {!isOpen && <i className="fas fa-caret-right flex" />}
          </div>
        )}
        <div ref={ref} className="flex relative grow basis-0 overflow-hidden" onClick={handleClickSelect}>
          <Contenteditable
            className={classNames(
              'focus-visible:px-1 focus-visible:m-[1px] focus-visible:outline-dashed focus-visible:outline-1',
              'truncate focus-visible:text-clip focus-visible:overflow-auto focus-visible:text-black focus-visible:outline-blue-500',
              { 'opacity-30': dragHovered }
            )}
            value={label}
            onChange={handleChange}
            openMode="doubleClick"
          />
          {dragHovered && (
            <span
              className={classNames('tree__node-drop-indicator p-1', {
                [`drop-indicator--${dropPosition}`]: dropPosition,
                'drop-indicator--not-allowed': !dragAllowed
              })}
            />
          )}
        </div>
        {actionsChildren}
      </div>
    </div>
  );
};

TreeNode.Actions = TreeNodeActions;

export default memo(TreeNode);
