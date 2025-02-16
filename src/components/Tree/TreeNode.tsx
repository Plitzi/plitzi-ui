import classNames from 'classnames';
import { cloneElement, isValidElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Contenteditable from '@components/ContentEditable';
import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

// Relatives
import { getPaddingLeft } from './utils';

import type TreeStyles from './Tree.styles';
import type { variantKeys } from './Tree.styles';
import type { DragMetadata, DropPosition } from './utils';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { DragEvent, MouseEvent, ReactElement, ReactNode } from 'react';

export type ItemControlsProps = {
  id?: string;
  hovered?: boolean;
  selected?: boolean;
  parentSelected?: boolean;
} & { [key: string]: unknown };

export type TreeNodeProps = {
  controls?: ReactNode;
  className?: string;
  icon?: ReactNode;
  id?: string;
  parentNodeId?: string;
  level?: number;
  isOpen?: boolean;
  isParent?: boolean;
  hovered?: boolean;
  parentSelected?: boolean;
  selected?: boolean;
  canDragDrop?: boolean;
  label?: string;
  setOpened?: (id: string, isOpen: boolean) => void;
  setDragMetadata?: (metadata: DragMetadata) => void;
  getDragMetadata?: () => DragMetadata;
  resetDragMetadata?: () => void;
  isDragAllowed?: (id: string, dropPosition: DropPosition, parentId?: string) => boolean;
  onChange?: (id: string, value: string) => void;
  onHover?: (id?: string) => void;
  onSelect?: (id?: string) => void;
  onDrop?: (event: DragEvent, id: string, toId: string, dropPosition: DropPosition) => void;
} & useThemeSharedProps<typeof TreeStyles, typeof variantKeys>;

const TreeNodeOriginal = ({
  controls,
  icon,
  className = '',
  id = '',
  parentNodeId = '',
  level = 0,
  isOpen = false,
  isParent = false,
  hovered = false,
  parentSelected = false,
  selected = false,
  canDragDrop = true,
  label = '',
  intent,
  size,
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
    componentKey: ['item', 'dropIndicator', 'containerEditable', 'collapsableIcon', 'icon'],
    variant: { intent, size, selected, hovered, parentSelected, dropPosition, dragAllowed, isOpen }
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
  }, [dragHovered]);

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

    const offsetDeltaY = clientRect.current.height * 0.25;
    const noParentOffsetDeltaY = clientRect.current.height / 2;
    const offsetY = e.clientY - clientRect.current.top;
    let newDropPosition: DropPosition;
    if (offsetY < offsetDeltaY || (!isParent && offsetY < noParentOffsetDeltaY)) {
      newDropPosition = 'top';
    } else if (offsetY > clientRect.current.height - offsetDeltaY || (!isParent && offsetY >= noParentOffsetDeltaY)) {
      newDropPosition = 'bottom';
    } else {
      newDropPosition = 'inside';
    }

    if (nodeHoveredId !== id || dropPosition !== newDropPosition) {
      setDragMetadata?.({ nodeHoveredId: id, dropPosition: newDropPosition });
    }

    if (!dragHovered || dropPosition !== newDropPosition) {
      setDragHovered(true);
      setDropPosition(newDropPosition);
      setDragAllowed(isDragAllowed?.(id, newDropPosition, parentNodeId) ?? true);
    }
  };

  const handleDragLeave = useCallback(() => {
    if (dragHovered) {
      setDragHovered(false);
      setDragAllowed(true);
      setDropPosition(undefined);
    }
  }, [dragHovered]);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const { nodeId, dropPosition } = getDragMetadata?.() ?? ({} as DragMetadata);
      setDragHovered(false);
      setDragAllowed(true);
      setDropPosition(undefined);
      resetDragMetadata?.();
      if (nodeId !== id) {
        onDrop?.(e, nodeId as string, id, dropPosition as DropPosition);
      }
    },
    [getDragMetadata, id, onDrop, resetDragMetadata]
  );

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

  const iconChildren = useMemo(() => {
    if (typeof icon === 'string' && !icon.startsWith('http')) {
      return <TreeNode.Icon intent="custom" size={size} icon={icon} className={classNameTheme.icon} />;
    }

    if (typeof icon === 'string' && icon.startsWith('http')) {
      return (
        <TreeNode.Icon intent="custom" size={size} className={classNameTheme.icon}>
          <img src={icon} />
        </TreeNode.Icon>
      );
    }

    if (!isValidElement(icon)) {
      return undefined;
    }

    return cloneElement<IconProps>(icon as ReactElement<IconProps>, {
      ...(icon.props as IconProps),
      size,
      className: classNames((icon.props as IconProps).className, classNameTheme.icon)
    });
  }, [icon, size, classNameTheme.icon]);

  const actionsChildren = useMemo(() => {
    if (!isValidElement(controls)) {
      return undefined;
    }

    return cloneElement<ItemControlsProps>(controls as ReactElement<ItemControlsProps>, {
      intent,
      size,
      ...(controls.props as ItemControlsProps),
      id,
      hovered,
      selected,
      parentSelected
    });
  }, [controls, hovered, parentSelected, id, selected, intent, size]);

  return (
    <div
      ref={ref}
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
      <div className="w-full flex items-center gap-2" style={{ paddingLeft: `${getPaddingLeft(level, size)}px` }}>
        {iconChildren}
        <div className="flex relative grow basis-0 overflow-hidden">
          <Contenteditable
            className={classNames(classNameTheme.containerEditable, {
              'opacity-30': dragHovered && dropPosition !== 'inside'
            })}
            size={size}
            value={label}
            onChange={handleChange}
            openMode="doubleClick"
          />
          {dragHovered && <span className={classNameTheme.dropIndicator} />}
        </div>
        {actionsChildren}
        {isParent && (
          <div className={classNameTheme.collapsableIcon} onClick={handleClick}>
            {!isOpen && <Icon icon="fa-solid fa-chevron-left" intent="custom" size="xs" />}
            {isOpen && <Icon icon="fa-solid fa-chevron-down" intent="custom" size="xs" />}
          </div>
        )}
      </div>
    </div>
  );
};

const TreeNode = Object.assign(memo(TreeNodeOriginal), { Icon });

export default TreeNode;
