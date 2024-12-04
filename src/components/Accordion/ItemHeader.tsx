// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { variantKeys } from './Accordion.styles';
import type AccordionStyles from './Accordion.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode } from 'react';

export type ItemHeaderProps = {
  children?: ReactNode;
  title?: string;
  isOpen?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  testId?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys>;

const ItemHeader = ({
  className,
  title = 'Accordion Item Title',
  isOpen = false,
  isError = false,
  isWarning = false,
  testId = '',
  children,
  intent,
  onClick
}: ItemHeaderProps) => {
  const classNameTheme = useTheme<typeof AccordionStyles, typeof variantKeys, false>('Accordion', {
    componentKey: ['itemHeader', 'itemHeaderIcon', 'itemHeaderIconError', 'itemHeaderSlot', 'itemHeaderIconWarning'],
    className,
    variant: { intent }
  });

  return (
    <div
      data-testid={testId ? `${testId}accordion-item-header` : undefined}
      className={classNameTheme.itemHeader}
      onClick={onClick}
    >
      {title}
      <div className={classNameTheme.itemHeaderSlot}>
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
        <div className={classNameTheme.itemHeaderIcon}>
          {!isOpen && <i className="fa-solid fa-chevron-right" />}
          {isOpen && <i className="fa-solid fa-chevron-down" />}
        </div>
      </div>
    </div>
  );
};

export default ItemHeader;
