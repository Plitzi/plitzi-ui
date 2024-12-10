// Packages
import classNames from 'classnames';

// Alias
import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

// Types
import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode } from 'react';

export type ItemHeaderProps = {
  children?: ReactNode;
  title?: ReactNode;
  isOpen?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  testId?: string;
  iconCollapsed?: ReactNode;
  iconExpanded?: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex>;

const iconCollapsedDefault = <i className="fa-solid fa-chevron-right" />;
const iconExpandedDefault = <i className="fa-solid fa-chevron-down" />;

const ItemHeader = ({
  className,
  title = 'Accordion Item Title',
  isOpen = false,
  isError = false,
  isWarning = false,
  iconCollapsed = iconCollapsedDefault,
  iconExpanded = iconExpandedDefault,
  testId = '',
  children,
  intent,
  direction = 'row',
  wrap,
  items = 'center',
  justify = 'between',
  gap = 4,
  grow = false,
  basis = 0,
  size,
  onClick
}: ItemHeaderProps) => {
  const classNameTheme = useTheme<typeof AccordionStyles, typeof variantKeys & typeof variantKeysFlex, false>(
    'Accordion',
    {
      componentKey: ['itemHeader', 'itemHeaderIcon', 'itemHeaderIconError', 'itemHeaderSlot', 'itemHeaderIconWarning'],
      className,
      variant: { intent, size }
    }
  );

  return (
    <Flex
      testId={testId ? `${testId}-accordion-item-header` : undefined}
      className={classNameTheme.itemHeader}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      basis={basis}
      grow={grow}
      onClick={onClick}
    >
      <div className={classNames('flex items-center gap-4', { 'flex-row-reverse': direction === 'row-reverse' })}>
        {iconCollapsed && iconExpanded && (
          <div className={classNameTheme.itemHeaderIcon}>
            {!isOpen && iconCollapsed}
            {isOpen && iconExpanded}
          </div>
        )}
        {title}
      </div>
      <Flex items="center" gap={2} direction={direction} className={classNameTheme.itemHeaderSlot}>
        {isError && (
          <div className={classNameTheme.itemHeaderIconError}>
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
        )}
        {isWarning && (
          <div className={classNameTheme.itemHeaderIconWarning}>
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
        )}
        {children}
      </Flex>
    </Flex>
  );
};

export default ItemHeader;