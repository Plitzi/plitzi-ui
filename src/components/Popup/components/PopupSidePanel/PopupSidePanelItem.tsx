import { useCallback } from 'react';

import Accordion, { useAccordion } from '@components/Accordion';
import Button from '@components/Button';
import useTheme from '@hooks/useTheme';

import type PopupStyles from '../../Popup.styles';
import type { variantKeys } from '../../Popup.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode } from 'react';

export type PopupSidePanelItemProps = {
  children?: ReactNode;
  id: string;
  title?: ReactNode;
  allowFloatingSide?: boolean;
  minSize?: number;
  maxSize?: number;
  onClickFloating?: (id: string) => void;
  onClickCollapse?: (id: string) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidePanelItem = ({
  children,
  id,
  className,
  title = '',
  allowFloatingSide = true,
  minSize,
  maxSize,
  placement,
  size,
  onClickCollapse,
  onClickFloating
}: PopupSidePanelItemProps) => {
  const { isOpen } = useAccordion();

  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: ['sidePanelItem', 'sidePanelItemHeader', 'btn'],
    variants: { size, expanded: isOpen(id) }
  });

  const handleClickCollapse = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClickCollapse?.(id);
    },
    [id, onClickCollapse]
  );

  const handleClickFloating = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClickFloating?.(id);
    },
    [id, onClickFloating]
  );

  return (
    <Accordion.Item key={id} id={id} grow className={classNameTheme.sidePanelItem} minSize={minSize} maxSize={maxSize}>
      <Accordion.Item.Header
        className={classNameTheme.sidePanelItemHeader}
        title={title}
        iconExpanded={null}
        iconCollapsed={null}
      >
        {allowFloatingSide && (
          <Button
            intent="custom"
            size="custom"
            border="none"
            className={classNameTheme.btn}
            title="Floating Popup"
            onClick={handleClickFloating}
          >
            <Button.Icon icon="fas fa-window-restore" />
          </Button>
        )}
        <Button
          intent="custom"
          size="custom"
          border="none"
          className={classNameTheme.btn}
          title="Hide"
          onClick={handleClickCollapse}
        >
          <Button.Icon icon={placement === 'left' ? 'fa-solid fa-angles-left' : 'fa-solid fa-angles-right'} />
        </Button>
      </Accordion.Item.Header>
      <Accordion.Item.Content size={size}>{children}</Accordion.Item.Content>
    </Accordion.Item>
  );
};

export default PopupSidePanelItem;
