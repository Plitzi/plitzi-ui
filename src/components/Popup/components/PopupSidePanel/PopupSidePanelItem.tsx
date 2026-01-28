import { useCallback } from 'react';

import Accordion, { useAccordion } from '@components/Accordion';
import Button from '@components/Button';
import useTheme from '@hooks/useTheme';

import type PopupStyles from '../../Popup.styles';
import type { variantKeys } from '../../Popup.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type PopupSidePanelItemProps = {
  id: string;
  title?: ReactNode;
  allowFloatingSide?: boolean;
  component?: ReactNode;
  onClickFloating?: (id: string) => void;
  onClickCollapse?: (id: string) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

const PopupSidePanelItem = ({
  id,
  className,
  title = '',
  allowFloatingSide = true,
  placement,
  component,
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

  const handleClickCollapse = useCallback(() => onClickCollapse?.(id), [id, onClickCollapse]);

  const handleClickFloating = useCallback(() => onClickFloating?.(id), [id, onClickFloating]);

  return (
    <Accordion.Item key={id} id={id} grow className={classNameTheme.sidePanelItem}>
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
      <Accordion.Item.Content size={size}>{component}</Accordion.Item.Content>
    </Accordion.Item>
  );
};

export default PopupSidePanelItem;
