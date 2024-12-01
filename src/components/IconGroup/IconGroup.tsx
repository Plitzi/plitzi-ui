// Packages
import { Children, cloneElement, isValidElement, useMemo } from 'react';

// Alias
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

// Relatives
import IconSeparator from './IconSeparator';

// Types
import type IconGroupStyles from './IconGroup.styles';
import type { variantKeys } from './IconGroup.styles';
import type { IconSeparatorProps } from './IconSeparator';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { IconProps } from '@components/Icon';
import type { variantKeys as variantKeysIcon } from '@components/Icon/Icon.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode } from 'react';

export type IconGroupProps = { children?: ReactNode } & useThemeSharedProps<
  typeof IconGroupStyles,
  typeof variantKeys & typeof variantKeysFlex & typeof variantKeysIcon
>;

const IconGroup = ({
  className,
  children,
  intent,
  size,
  direction,
  wrap,
  items = 'center',
  justify = 'between',
  gap = 2
}: IconGroupProps) => {
  const classNameTheme = useTheme<typeof IconGroupStyles, typeof variantKeys, false>('IconGroup', {
    className,
    componentKey: ['root', 'icon', 'separator'],
    variant: { intent, size, direction }
  });

  const { icons } = useMemo(() => {
    const components = {
      icons: [] as ReactNode[]
    };

    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        components.icons.push(
          cloneElement<IconProps>(child as ReactElement<IconProps>, {
            key: i,
            className: classNameTheme.icon,
            size,
            intent,
            ...(child.props as IconProps)
          })
        );
      } else if (child.type === IconSeparator) {
        components.icons.push(
          cloneElement<IconSeparatorProps>(child as ReactElement<IconSeparatorProps>, {
            key: i,
            size,
            intent,
            ...(child.props as IconSeparatorProps)
          })
        );
      }
    });

    return components;
  }, [children, classNameTheme, size, intent]);

  return (
    <Flex className={classNameTheme.root} direction={direction} wrap={wrap} items={items} gap={gap} justify={justify}>
      {icons}
    </Flex>
  );
};

IconGroup.Separator = IconSeparator;

IconGroup.Icon = Icon;

export default IconGroup;
