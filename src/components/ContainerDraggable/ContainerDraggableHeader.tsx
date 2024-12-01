// Packages
import classNames from 'classnames';
import { useCallback } from 'react';

// Alias
import Button from '@components/Button';
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Types
import type ContainerDraggableStyles from './ContainerDraggable.styles';
import type { variantKeys } from './ContainerDraggable.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type ContainerDraggableHeaderProps = {
  icon: ReactNode;
  title?: ReactNode;
  customActions: ReactNode[];
  allowExternal?: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setExternalWindow: Dispatch<SetStateAction<boolean>>;
  onClose?: (e: MouseEvent | React.MouseEvent) => void;
  onCollapse?: (collapsed: boolean) => void;
  onMouseDown: (e: MouseEvent | React.MouseEvent) => void;
  onTouchStart: (e: TouchEvent | React.TouchEvent) => void;
} & useThemeSharedProps<typeof ContainerDraggableStyles, typeof variantKeys>;

const ContainerDraggableHeader = ({
  className,
  intent,
  size,
  collapsed,
  icon,
  title,
  allowExternal = true,
  customActions,
  setCollapsed,
  setExternalWindow,
  onClose,
  onCollapse,
  onMouseDown,
  onTouchStart
}: ContainerDraggableHeaderProps) => {
  const classNameTheme = useTheme<typeof ContainerDraggableStyles, typeof variantKeys, false>('ContainerDraggable', {
    className,
    componentKey: ['header', 'headerLabel', 'btn'],
    variant: { intent, size, collapsed }
  });

  const handleClickClose = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation();
      onClose?.(e);
    },
    [onClose]
  );

  const handleClickCollapse = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation();
      setCollapsed(state => {
        onCollapse?.(!state);

        return !state;
      });
    },
    [onCollapse, setCollapsed]
  );

  const handleClickExternal = useCallback(() => setExternalWindow(state => !state), [setExternalWindow]);

  return (
    <div className={classNameTheme.header}>
      <label className={classNameTheme.headerLabel} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        {icon}
        {title}
      </label>
      <Flex items="center">
        {customActions}
        <Button
          intent="custom"
          size="custom"
          border="none"
          items="end"
          className={classNames('', classNameTheme.btn)}
          title="Collapse / Expand"
          content=""
          onClick={handleClickCollapse}
        >
          <Button.Icon icon={collapsed ? 'far fa-window-maximize' : 'fas fa-minus'} />
        </Button>
        {allowExternal && (
          <Button
            intent="custom"
            size="custom"
            border="none"
            className={classNameTheme.btn}
            title="External Window"
            content=""
            onClick={handleClickExternal}
          >
            <Button.Icon icon="fas fa-window-restore" />
          </Button>
        )}
        <Button
          intent="custom"
          size="custom"
          border="none"
          className={classNames(' text-red-400 hover:text-red-500', classNameTheme.btn)}
          title="Close"
          content=""
          onClick={handleClickClose}
        >
          <Button.Icon icon="fas fa-times" />
        </Button>
      </Flex>
    </div>
  );
};

export default ContainerDraggableHeader;
