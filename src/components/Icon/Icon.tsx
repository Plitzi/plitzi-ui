// Packages
import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useMemo } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import { getIntent } from './utils';

// Types
import type IconStyles from './Icon.styles';
import type { variantKeys } from './Icon.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type IconProps = {
  children?: ReactNode;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
} & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof IconStyles, typeof variantKeys>;

type childProps = { className?: string; [key: string]: unknown };

const Icon = ({
  className,
  children,
  icon,
  active = false,
  disabled = false,
  intent,
  size,
  cursor,
  title,
  ...props
}: IconProps) => {
  className = useTheme<typeof IconStyles, typeof variantKeys>('Icon', {
    className,
    componentKey: 'root',
    variant: {
      intent: getIntent(disabled, active, intent),
      size,
      cursor: disabled ? 'disabled' : cursor
    }
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
        className: classNames(className, (child.props as childProps).className),
        ...props,
        title
      });
    });

    return components;
  }, [children, className, props, title]);

  if (iconChildren) {
    return iconChildren;
  }

  return <i {...props} title={title} className={classNames(icon, className)} />;
};

export default Icon;
