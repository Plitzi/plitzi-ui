// Alias
import DynamicComponent from '@/helpers/DynamicComponent';
import useTheme from '@hooks/useTheme';

// Types
import type HeadingStyles from './Heading.styles';
import type { variantKeys } from './Heading.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type HeadingProps = { children?: ReactNode; testId?: string } & useThemeSharedProps<
  typeof HeadingStyles,
  typeof variantKeys
>;

const Heading = ({ as = 'h1', className = '', children = 'Heading', testId, ...props }: HeadingProps) => {
  className = useTheme<typeof HeadingStyles, typeof variantKeys>('Heading', {
    className,
    componentKey: 'root',
    variant: { as }
  });

  return (
    <DynamicComponent {...props} tag={as} data-testid={testId} className={className}>
      {children}
    </DynamicComponent>
  );
};

export default Heading;
