// Packages
import classNames from 'classnames';
import { Children, isValidElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Alias
import Contenteditable from '@components/ContentEditable';
import Icon from '@components/Icon';
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
  const [dragAllowed, setDragAllowed] = useState(true);
  const [dropPosition, setDropPosition] = useState<DropPosition>();
  const classNameTheme = useTheme<typeof TreeStyles, typeof variantKeys, false>('Tree', {
    className,
    componentKey: ['item', 'dropIndicator', 'containerEditable'],
    variant: { selected, hovered, dropPosition, dragAllowed }
  });
  const clientRect = useRef<DOMRect | undefined>({} as DOMRect);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isParent) {
        setOpened?.(id, !isOpen);
      }
    },
    [id, isOpen, setOpened, isParent]
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
      className={classNameTheme.item}
      data-id={id}
      onClick={handleClickSelect}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={canDragDrop}
      onMouseOver={handleHover}
      onMouseLeave={handleMouseLeave}
      tabIndex={-1}
    >
      <div className="w-full flex" style={{ paddingLeft: `${paddingRight}px` }}>
        <div ref={ref} className="flex relative grow basis-0 overflow-hidden">
          <Contenteditable
            className={classNames(classNameTheme.containerEditable, { 'opacity-30': dragHovered })}
            value={label}
            onChange={handleChange}
            openMode="doubleClick"
          />
          {dragHovered && <span className={classNameTheme.dropIndicator} />}
        </div>
        {actionsChildren}
        {isParent && (
          <div className="w-4 flex items-center cursor-pointer" onClick={handleClick}>
            {!isOpen && <Icon icon="fa-solid fa-chevron-left" />}
            {isOpen && <Icon icon="fa-solid fa-chevron-down" />}
          </div>
        )}
      </div>
    </div>
  );
};

TreeNode.Actions = TreeNodeActions;

export default memo(TreeNode);
