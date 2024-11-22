// Packages
import { useCallback } from 'react';
import classNames from 'classnames';

// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type TextAreaStyles from './TextArea.styles';
import type { variantKeys } from './TextArea.styles';
import type { ChangeEvent, Ref } from 'react';

export type TextAreaProps = {
  ref?: Ref<HTMLTextAreaElement>;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  value?: string;
  onChange?: (value: string) => void;
} & useThemeSharedProps<typeof TextAreaStyles, typeof variantKeys>;

const TextArea = ({
  ref,
  className = '',
  placeholder = 'Text',
  loading = false,
  disabled = false,
  hasError = false,
  size = 'base',
  intent = 'default',
  value = '',
  onChange,
  ...textareaProps
}: TextAreaProps) => {
  const classNameTheme = useTheme<typeof TextAreaStyles, typeof variantKeys, false>('TextArea', {
    className,
    componentKey: ['root', 'input', 'inputContainer', 'iconFloatingContainer', 'iconError'],
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={classNameTheme.root}>
      <div className={classNameTheme.inputContainer}>
        <textarea
          ref={ref}
          placeholder={placeholder}
          className={classNameTheme.input}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          {...(textareaProps as React.JSX.IntrinsicElements['textarea'])}
        />
        {(hasError || loading) && (
          <div className={classNameTheme.iconFloatingContainer}>
            {hasError && <i className={classNames('fa-solid fa-circle-exclamation', classNameTheme.iconError)} />}
            {loading && <i className={classNames('fa-solid fa-sync fa-spin', classNameTheme.iconLoading)} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
