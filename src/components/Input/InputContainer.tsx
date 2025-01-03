// Packages
import classNames from 'classnames';
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

// Alias
import ErrorMessage from '@components/ErrorMessage';
import Icon from '@components/Icon';
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

// Types
import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode } from 'react';

type InputContainerProps = {
  label?: string;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  disabled?: boolean;
  intent?: string;
  size?: string;
  prefix?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  clearable?: boolean;
  value?: unknown;
  onClear?: (e: MouseEvent) => void;
} & Omit<useThemeSharedProps<typeof InputStyles, typeof variantKeys>, 'error'>;

const InputContainer = ({
  className,
  label,
  error,
  disabled,
  intent,
  size,
  prefix,
  children,
  loading,
  clearable,
  value,
  onClear
}: InputContainerProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys, false>('Input', {
    className,
    componentKey: ['root', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'iconClear'],
    variant: {
      intent,
      size,
      disabled: disabled || loading,
      error: !!error
    }
  });

  const handleClickClear = useCallback((e: MouseEvent) => onClear?.(e), [onClear]);

  const { iconChildren, inputChildren } = useMemo(() => {
    const components: { iconChildren: ReactNode; inputChildren: ReactNode } = {
      iconChildren: undefined,
      inputChildren: undefined
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
      } else {
        components.inputChildren = child;
      }
    });

    return components;
  }, [children, classNameTheme.icon, size]);

  return (
    <div className={classNameTheme.root}>
      {label && (
        <Label error={!!error} disabled={disabled} intent={intent} size={size}>
          {label}
        </Label>
      )}
      <div className={classNameTheme.inputContainer}>
        {iconChildren}
        {prefix && <div>{prefix}</div>}
        {inputChildren}
        {!disabled && (!!error || loading || (clearable && !!value)) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {error && !loading && (
              <Icon intent="custom" icon="fa-solid fa-circle-exclamation" className={classNameTheme.iconError} />
            )}
            {loading && <Icon icon="fa-solid fa-sync fa-spin" className={classNameTheme.iconLoading} />}
            {!loading && clearable && !!value && (
              <Icon className={classNameTheme.iconClear} icon="fa-solid fa-xmark" onClick={handleClickClear} />
            )}
          </div>
        )}
      </div>
      {error && (
        <ErrorMessage message={typeof error === 'boolean' ? '' : error} intent={intent} size={size} error={!!error} />
      )}
    </div>
  );
};

export default InputContainer;
