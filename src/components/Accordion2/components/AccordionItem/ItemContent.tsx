import useTheme from '@hooks/useTheme';

import type { variantKeys } from '../../Accordion.styles';
import type AccordionStyles from '../../Accordion.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type ItemContentProps = {
  children?: ReactNode;
  testId?: string;
  onClick?: () => void;
} & useThemeSharedProps<typeof AccordionStyles, typeof variantKeys>;

const ItemContent = ({ className, children, testId = '', intent, size, grow }: ItemContentProps) => {
  className = useTheme<typeof AccordionStyles, typeof variantKeys>('Accordion', {
    componentKey: 'itemContent',
    className,
    variants: { intent, size, grow }
  });

  return (
    <div data-testid={testId ? `${testId}accordion-item-content` : undefined} className={className}>
      {children}
    </div>
  );
};

export default ItemContent;
