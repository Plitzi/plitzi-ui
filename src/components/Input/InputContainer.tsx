import clsx from 'clsx';
import { Children, cloneElement, isValidElement, useCallback, useMemo } from 'react';

import ErrorMessage from '@components/ErrorMessage';
import Icon from '@components/Icon';
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

import { getInputFieldIds } from './hooks/useInputField';

import type InputStyles from './Input.styles';
import type { variantKeys } from './Input.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type InputContainerProps = {
  ref?: RefObject<HTMLDivElement | null>;
  /** The control's id: the label points at it, and the label's and error message's own ids derive from it. */
  id?: string;
  /**
   * The control names the label itself with `aria-labelledby` instead of the label pointing at it: for a control that
   * is not labelable, such as a group or a contenteditable editor.
   */
  labelledByControl?: boolean;
  label?: ReactNode;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  disabled?: boolean;
  intent?: string;
  size?: string;
  prefix?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  clearable?: boolean;
  inline?: boolean;
  value?: unknown;
  onClear?: (e: MouseEvent) => void;
} & Omit<useThemeSharedProps<typeof InputStyles, typeof variantKeys>, 'error'> &
  Omit<HTMLAttributes<HTMLDivElement>, 'className'>;

const InputContainer = ({
  ref,
  className,
  id,
  labelledByControl = false,
  label,
  error,
  disabled,
  intent,
  size,
  prefix,
  children,
  loading,
  clearable,
  inline,
  value,
  onClear,
  ...otherProps
}: InputContainerProps) => {
  const classNameTheme = useTheme<typeof InputStyles, typeof variantKeys>('Input', {
    className,
    componentKey: ['root', 'label', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'iconClear'],
    variants: {
      intent,
      size,
      disabled: disabled || loading,
      error: !!error,
      inline
    }
  });

  const handleClickClear = useCallback((e: MouseEvent) => onClear?.(e), [onClear]);

  const { labelId, errorId } = id ? getInputFieldIds(id) : { labelId: undefined, errorId: undefined };
  const htmlFor = labelledByControl ? undefined : id;

  const { iconChildren, inputChildren } = useMemo(() => {
    const components: { iconChildren: ReactNode; inputChildren: ReactNode[] } = {
      iconChildren: undefined,
      inputChildren: []
    };
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.iconChildren = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          className: clsx(classNameTheme.icon, childProps.className),
          size,
          ...childProps,
          intent: childProps.intent ?? 'custom'
        });
      } else {
        components.inputChildren.push(child);
      }
    });

    return components;
  }, [children, classNameTheme.icon, size]);

  return (
    <div className={classNameTheme.root} ref={ref} {...otherProps}>
      {label && !inline && (
        <Label
          error={!!error}
          disabled={disabled}
          intent={intent}
          size={size}
          id={labelId}
          htmlFor={htmlFor}
          className={classNameTheme.label}
        >
          {label}
        </Label>
      )}
      <div className={classNameTheme.inputContainer}>
        {iconChildren}
        {!!prefix && prefix}
        {!inline && inputChildren}
        {inline && (
          <Label
            error={!!error}
            disabled={disabled}
            intent={intent}
            size={size}
            id={labelId}
            htmlFor={htmlFor}
            className={classNameTheme.label}
          >
            {inputChildren}
            {label}
          </Label>
        )}
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
        <ErrorMessage
          id={errorId}
          message={typeof error === 'boolean' ? '' : error}
          intent={intent}
          size={size}
          error={!!error}
        />
      )}
    </div>
  );
};

export default InputContainer;
