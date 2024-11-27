// Packages
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type IconStyles from './Icon.styles';
import type { variantKeys } from './Icon.styles';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type IconProps = { children?: ReactNode; icon?: string; active?: boolean } & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof IconStyles, typeof variantKeys>;

type childProps = { className?: string; [key: string]: unknown };

const Icon = ({ className, children, icon, active = false, intent, size, cursor, ...props }: IconProps) => {
  className = useTheme<typeof IconStyles, typeof variantKeys>('Icon', {
    className,
    componentKey: 'root',
    variant: { intent: active ? 'active' : intent, size, cursor }
  });

  const { iconChildren } = useMemo(() => {
    const components = {
      iconChildren: undefined as ReactNode
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      components.iconChildren = cloneElement<childProps>(child as ReactElement<childProps>, {
        className: classNames(className, (child.props as childProps)?.className),
        ...props
      });
    });

    return components;
  }, [children, className, props]);

  if (iconChildren) {
    return iconChildren;
  }

  return <i {...props} className={classNames(icon, className)} />;
};

export default Icon;
