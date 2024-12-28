// Packages
import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useMemo } from 'react';

// Alias
import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import type ButtonStyles from './Button.styles';
import type { variantKeys } from './Button.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode, Ref, ButtonHTMLAttributes, JSX } from 'react';

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
  testId?: string;
  content?: ReactNode;
  iconPlacement?: 'before' | 'after' | 'both' | 'none';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & ButtonHTMLAttributes<HTMLButtonElement> &
  useThemeSharedProps<typeof ButtonStyles, typeof variantKeys>;

const Button = ({
  ref,
  children,
  content = 'Button',
  testId,
  className = '',
  iconPlacement = 'none',
  loading = false,
  disabled = false,
  type = 'button',
  size,
  intent,
  border,
  justify,
  items,
  ...buttonProps
}: ButtonProps) => {
  const classNameTheme = useTheme<typeof ButtonStyles, typeof variantKeys, false>('Button', {
    className,
    componentKey: ['root', 'icon'],
    variant: { intent, size, border, justify, items }
  });

  const { iconChildren } = useMemo(() => {
    const components = {
      iconChildren: undefined as ReactNode
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          className: classNames(classNameTheme.icon, childProps.className),
          size,
          ...childProps,
          intent: childProps.intent ?? 'custom'
        });
      }
    });

    return components;
  }, [children, classNameTheme.icon, size]);

  return (
    <button
      ref={ref}
      type={type}
      data-testid={testId}
      className={classNameTheme.root}
      disabled={disabled}
      {...(buttonProps as JSX.IntrinsicElements['button'])}
    >
      {!loading && content && (
        <>
          {(iconPlacement === 'before' || iconPlacement === 'both') && content && iconChildren}
          {content}
          {(iconPlacement === 'after' || iconPlacement === 'both') && content && iconChildren}
        </>
      )}
      {!loading && !content && iconChildren}
      {loading && <i className="fa-solid fa-sync fa-spin text-base" />}
    </button>
  );
};

Button.Icon = Icon;

export default Button;
