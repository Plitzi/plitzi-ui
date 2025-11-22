import clsx from 'clsx';
import { Children, cloneElement, isValidElement, useMemo } from 'react';

import useTheme from '@hooks/useTheme';

import { getIntent } from './utils';

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
  testId?: string;
} & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof IconStyles, typeof variantKeys>;

type childProps = { className?: string; [key: string]: unknown };

const Icon = ({
  className,
  children,
  icon,
  active = false,
  disabled = false,
  testId,
  intent,
  size,
  cursor,
  title,
  ...props
}: IconProps) => {
  className = useTheme<typeof IconStyles, typeof variantKeys>('Icon', {
    className,
    componentKey: 'root',
    variants: {
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
        className: clsx(className, (child.props as childProps).className),
        ...props,
        title
      });
    });

    return components;
  }, [children, className, props, title]);

  if (iconChildren) {
    return iconChildren;
  }

  return <i {...props} title={title} data-testid={testId} className={clsx(icon, className)} />;
};

export default Icon;
