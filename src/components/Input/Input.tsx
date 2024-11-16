// Packages
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { Ref } from 'react';

export type InputProps = {
  ref?: Ref<HTMLInputElement>;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'text';
} & useThemeSharedProps<typeof InputStyles, typeof variantKeys>;

const Input = ({
  ref,
  className = '',
  icon = 'fa-solid fa-check',
  loading = false,
  disabled = false,
  type = 'text',
  size = 'base',
  intent = 'default',
  ...inputProps
}: InputProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys, false>('Input', {
    className,
    componentKey: ['root'],
    variant: { intent: disabled ? 'disabled' : intent, size }
  });

  return (
    <input
      ref={ref}
      type={type}
      className={classNames(classNameTheme.root)}
      disabled={disabled}
      {...(inputProps as React.JSX.IntrinsicElements['input'])}
    >
      {/* {(iconPlacement === 'before' || iconPlacement === 'both') && (
        <i className={classNames(icon, classNameTheme.icon)} />
      )}
      {loading ? <i className="fa-solid fa-sync fa-spin text-base" /> : children}
      {(iconPlacement === 'after' || iconPlacement === 'both') && (
        <i className={classNames(icon, classNameTheme.icon)} />
      )} */}
    </input>
  );
};

export default Input;
