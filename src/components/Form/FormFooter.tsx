import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import type FormStyles from './Form.styles';
import type { variantKeys } from './Form.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode } from 'react';

export type FormFooterProps = { children?: ReactNode; testId?: string } & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof FormStyles, typeof variantKeys & typeof variantKeysFlex>;

const FormFooter = ({
  className,
  children,
  testId,
  direction,
  wrap,
  items,
  justify,
  alignItems,
  gap = 2,
  ...props
}: FormFooterProps) => {
  className = useTheme<typeof FormStyles, typeof variantKeys>('Form', {
    className,
    componentKey: 'footer'
  });

  return (
    <Flex
      {...props}
      testId={testId}
      className={className}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      alignItems={alignItems}
    >
      {children}
    </Flex>
  );
};

export default FormFooter;
