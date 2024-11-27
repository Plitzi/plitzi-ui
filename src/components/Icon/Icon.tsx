// Packages
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type IconStyles from './Icon.styles';
import type { variantKeys } from './Icon.styles';
import type { HTMLAttributes, ReactNode } from 'react';

export type IconProps = { children?: ReactNode; icon?: string } & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof IconStyles, typeof variantKeys>;

const Icon = ({ className, children, icon, intent, size, ...props }: IconProps) => {
  className = useTheme<typeof IconStyles, typeof variantKeys>('Icon', {
    className,
    componentKey: 'root',
    variant: { intent, size }
  });

  const { iconChildren } = useMemo(() => {
    const components = {
      iconChildren: undefined as ReactNode
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      components.iconChildren = cloneElement(child, { className } as Partial<typeof child.props>);
    });

    return components;
  }, [children, className]);

  if (iconChildren) {
    return iconChildren;
  }

  return <i {...props} className={classNames(icon, className)} />;
};

export default Icon;
