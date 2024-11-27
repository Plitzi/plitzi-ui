// Packages
import { Children, cloneElement, isValidElement, lazy, Suspense, useMemo } from 'react';
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type IconStyles from './Icon.styles';
import type { variantKeys } from './Icon.styles';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type IconProps = {
  children?: ReactNode;
  icon?: string;
  active?: boolean;
  width?: number;
  height?: number;
} & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof IconStyles, typeof variantKeys>;

type childProps = { className?: string; [key: string]: unknown };

const svgMap = ['DesktopWithMobile'] as string[];

const Icon = ({
  className,
  children,
  icon,
  active = false,
  width,
  height,
  intent,
  size,
  cursor,
  ...props
}: IconProps) => {
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

  const IconSVG = useMemo(() => {
    if (!icon || !svgMap.includes(icon)) {
      return;
    }

    return lazy(() => import(`./svg/${icon}`).catch(() => ({ default: () => <div>Not found</div> })));
  }, [icon]);

  if (iconChildren) {
    return iconChildren;
  }

  if (!IconSVG) {
    return <i {...props} className={classNames(icon, className)} />;
  }

  return (
    <Suspense>
      <IconSVG {...props} className={className} width={width} height={height} />
    </Suspense>
  );
};

export default Icon;
