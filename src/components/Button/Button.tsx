// Packages
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type ButtonStyles from './Button.styles';
import type { variantKeys } from './Button.styles';
import type { Ref } from 'react';

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  children?: React.ReactNode;
  icon?: string;
  iconPlacement?: 'before' | 'after' | 'both' | 'none';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & useThemeSharedProps<typeof variantKeys>;

const Button = ({
  ref,
  children = 'Button',
  className = '',
  icon = 'fa-solid fa-check',
  iconPlacement = 'none',
  loading = false,
  disabled = false,
  type = 'button',
  size = 'base',
  intent = 'primary',
  ...buttonProps
}: ButtonProps) => {
  const classNameTheme = useTheme<typeof ButtonStyles, typeof variantKeys, false>({
    className,
    componentKey: ['Button.root', 'Button.icon'],
    variant: { intent, size }
  });

  return (
    <button ref={ref} type={type} className={classNames(classNameTheme.root)} disabled={disabled} {...buttonProps}>
      {(iconPlacement === 'before' || iconPlacement === 'both') && (
        <i className={classNames(icon, classNameTheme.icon)} />
      )}
      {loading ? <i className="fa-solid fa-sync fa-spin text-base" /> : children}
      {(iconPlacement === 'after' || iconPlacement === 'both') && (
        <i className={classNames(icon, classNameTheme.icon)} />
      )}
    </button>
  );
};

export default Button;
