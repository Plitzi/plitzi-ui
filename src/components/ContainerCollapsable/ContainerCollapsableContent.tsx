// Alias
import useTheme from '@hooks/useTheme';

// Types
import type ContainerCollapsableStyles from './ContainerCollapsable.styles';
import type { variantKeys } from './ContainerCollapsable.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type ContainerCollapsableContentProps = {
  children?: ReactNode;
} & useThemeSharedProps<typeof ContainerCollapsableStyles, typeof variantKeys>;

const ContainerCollapsableContent = ({ className, children }: ContainerCollapsableContentProps) => {
  const classNameTheme = useTheme<typeof ContainerCollapsableStyles, typeof variantKeys, false>(
    'ContainerCollapsable',
    { className, componentKey: ['content'], variant: {} }
  );

  return <div className={classNameTheme.content}>{children}</div>;
};

export default ContainerCollapsableContent;
