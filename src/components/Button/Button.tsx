// Packages
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';
import Icon from '@components/Icon';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type ButtonStyles from './Button.styles';
import type { variantKeys } from './Button.styles';
import type { ReactElement, ReactNode, Ref } from 'react';
import type { IconProps } from '@components/Icon';

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
  content?: ReactNode;
  icon?: string;
  iconPlacement?: 'before' | 'after' | 'both' | 'none';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & useThemeSharedProps<typeof ButtonStyles, typeof variantKeys>;

const Button = ({
  ref,
  children,
  content = 'Button',
  className = '',
  icon = '',
  iconPlacement = 'none',
  loading = false,
  disabled = false,
  type = 'button',
  size,
  intent,
  border,
  ...buttonProps
}: ButtonProps) => {
  const classNameTheme = useTheme<typeof ButtonStyles, typeof variantKeys, false>('Button', {
    className,
    componentKey: ['root', 'icon'],
    variant: { intent, size, border }
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
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          icon,
          className: classNames(
            classNameTheme.icon,
            (child.props as IconProps).className,
            (child.props as IconProps).icon
          ),
          size,
          intent: 'custom'
        });
      }
    });

    return components;
  }, [children, icon, classNameTheme.icon, size]);

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(classNameTheme.root)}
      disabled={disabled}
      {...(buttonProps as React.JSX.IntrinsicElements['button'])}
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
