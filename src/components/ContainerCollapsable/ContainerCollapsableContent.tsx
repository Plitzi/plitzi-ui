import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import type ContainerCollapsableStyles from './ContainerCollapsable.styles';
import type { variantKeys } from './ContainerCollapsable.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type ContainerCollapsableContentProps = {
  children?: ReactNode;
} & useThemeSharedProps<typeof ContainerCollapsableStyles, typeof variantKeys & typeof variantKeysFlex>;

const ContainerCollapsableContent = ({
  className,
  children,
  direction = 'column',
  wrap,
  items,
  justify,
  gap,
  grow,
  shrink,
  basis
}: ContainerCollapsableContentProps) => {
  className = useTheme<typeof ContainerCollapsableStyles, typeof variantKeys>('ContainerCollapsable', {
    className,
    componentKey: 'content'
  });

  return (
    <Flex
      className={className}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      shrink={shrink}
      basis={basis}
      grow={grow}
    >
      {children}
    </Flex>
  );
};

export default ContainerCollapsableContent;
