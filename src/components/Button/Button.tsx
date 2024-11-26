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
import type { ReactNode, Ref } from 'react';
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
  icon = 'fa-solid fa-check',
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
    variant: { intent: disabled ? 'disabled' : intent, size, border }
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
        components.iconChildren = cloneElement(child, {
          icon,
          className: classNameTheme.icon,
          size,
          intent
        } as Partial<IconProps>);
      }
    });

    return components;
  }, [children, icon, classNameTheme.icon, size, intent]);

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(classNameTheme.root)}
      disabled={disabled}
      {...(buttonProps as React.JSX.IntrinsicElements['button'])}
    >
      {(iconPlacement === 'before' || iconPlacement === 'both') && iconChildren}
      {loading ? <i className="fa-solid fa-sync fa-spin text-base" /> : content}
      {(iconPlacement === 'after' || iconPlacement === 'both') && iconChildren}
    </button>
  );
};

Button.Icon = Icon;

export default Button;
