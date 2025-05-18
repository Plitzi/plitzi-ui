import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useMemo } from 'react';

import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import type ButtonStyles from './Button.styles';
import type { variantKeys } from './Button.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement, ReactNode, ButtonHTMLAttributes, JSX, RefObject } from 'react';

export type ButtonProps = {
  ref?: RefObject<HTMLButtonElement>;
  children?: ReactNode;
  testId?: string;
  iconPlacement?: 'before' | 'after' | 'both' | 'none';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'content'> &
  useThemeSharedProps<typeof ButtonStyles, typeof variantKeys>;

const Button = ({
  ref,
  children,
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
  aspect,
  ...buttonProps
}: ButtonProps) => {
  const classNameTheme = useTheme<typeof ButtonStyles, typeof variantKeys>('Button', {
    className,
    componentKey: ['root', 'icon'],
    variant: { intent, size, border, justify, items, disabled, aspect }
  });

  const { iconChildren, contentChildren } = useMemo(() => {
    const components: { iconChildren: ReactNode; contentChildren: ReactNode } = {
      iconChildren: undefined,
      contentChildren: undefined
    };
    Children.forEach(children, child => {
      if (typeof child === 'string') {
        components.contentChildren = child;

        return;
      }

      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          className: classNames(classNameTheme.icon, childProps.className),
          size,
          testId: testId ? `${testId}-icon` : undefined,
          ...childProps,
          intent: childProps.intent ?? 'custom'
        });
      } else if (child.type === 'i') {
        const childProps = child.props as IconProps;
        components.iconChildren = cloneElement<IconProps & { 'data-testid'?: string }>(
          child as ReactElement<IconProps>,
          {
            className: classNames(classNameTheme.icon, childProps.className),
            size,
            'data-testid': testId ? `${testId}-icon` : undefined,
            ...childProps,
            intent: childProps.intent ?? 'custom'
          }
        );
      } else {
        components.contentChildren = child;
      }
    });

    return components;
  }, [children, classNameTheme.icon, size, testId]);

  return (
    <button
      ref={ref}
      type={type}
      data-testid={testId}
      className={classNameTheme.root}
      disabled={disabled}
      {...(buttonProps as JSX.IntrinsicElements['button'])}
    >
      {!loading && contentChildren && (
        <>
          {(iconPlacement === 'before' || iconPlacement === 'both') && contentChildren && iconChildren}
          {contentChildren}
          {(iconPlacement === 'after' || iconPlacement === 'both') && contentChildren && iconChildren}
        </>
      )}
      {!loading && !contentChildren && iconChildren}
      {loading && <i className="fa-solid fa-sync fa-spin text-base" />}
    </button>
  );
};

Button.Icon = Icon;

export default Button;
