import { Children, cloneElement, isValidElement, useCallback, useMemo, useState } from 'react';

import Flex from '@components/Flex';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

import ContainerCollapsableContent from './ContainerCollapsableContent';
import ContainerCollapsableHeader from './ContainerCollapsableHeader';

import type ContainerCollapsableStyles from './ContainerCollapsable.styles';
import type { variantKeys } from './ContainerCollapsable.styles';
import type { ContainerCollapsableHeaderProps } from './ContainerCollapsableHeader';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, MouseEventHandler, ReactElement, ReactNode } from 'react';

export type ContainerCollapsableProps = {
  collapsed?: boolean;
  children?: ReactNode;
  onChange?: (collapsed: boolean) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'> &
  useThemeSharedProps<typeof ContainerCollapsableStyles, typeof variantKeys & typeof variantKeysFlex>;

const ContainerCollapsable = ({
  className = '',
  collapsed: collapsedProp = false,
  children,
  direction = 'column',
  wrap,
  items,
  justify,
  gap,
  grow,
  shrink,
  basis,
  onChange,
  ...otherProps
}: ContainerCollapsableProps) => {
  const [collapsed, setCollapsed] = useState(collapsedProp);
  className = useTheme<typeof ContainerCollapsableStyles, typeof variantKeys>('ContainerCollapsable', {
    className,
    componentKey: 'root'
  });

  useDidUpdateEffect(() => {
    setCollapsed(collapsedProp);
  }, [collapsedProp]);

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      e.stopPropagation();
      setCollapsed(!collapsed);
      onChange?.(!collapsed);
    },
    [collapsed, onChange]
  );

  const { header, content } = useMemo(() => {
    const components: { header?: ReactNode; content?: ReactNode } = { header: undefined, content: undefined };
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ContainerCollapsableHeader) {
        components.header = cloneElement<ContainerCollapsableHeaderProps>(
          child as ReactElement<ContainerCollapsableHeaderProps>,
          { ...(child.props as ContainerCollapsableHeaderProps), collapsed, onClick: handleClick }
        );
      } else if (child.type === ContainerCollapsableContent) {
        components.content = cloneElement(child);
      }
    });

    return components;
  }, [children, collapsed, handleClick]);

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
      grow={grow ? !collapsed : false}
      {...otherProps}
    >
      {header}
      {!collapsed && content}
    </Flex>
  );
};

ContainerCollapsable.Header = ContainerCollapsableHeader;
ContainerCollapsable.Content = ContainerCollapsableContent;

export default ContainerCollapsable;
