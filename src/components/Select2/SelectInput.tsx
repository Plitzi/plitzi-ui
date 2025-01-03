// Packages
import classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';

// Alias
import Input from '@components/Input';
import InputStyles from '@components/Input/Input.styles';
import useTheme from '@hooks/useTheme';

// Types
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { KeyboardEvent } from 'react';

type SelectInputProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  allowCreateOptions?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (value: { value: string; label: string }) => void;
} & useThemeSharedProps<typeof Select2Styles & typeof InputStyles, typeof variantKeys>;

const SelectInput = ({
  className = '',
  size = 'md',
  placeholder = '',
  value = '',
  disabled = false,
  autoFocus = true,
  allowCreateOptions = false,
  onChange,
  onSelect
}: SelectInputProps) => {
  className = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: 'searchInput',
    variant: { size }
  });
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback((value: string) => onChange?.(value), [onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && allowCreateOptions) {
        onSelect?.({ value: (e.target as HTMLInputElement).value, label: (e.target as HTMLInputElement).value });
      } else if (e.key === 'Enter' && !allowCreateOptions) {
        e.stopPropagation();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onChange?.('');
      }
    },
    [onChange, onSelect, allowCreateOptions]
  );

  return (
    <Input
      ref={ref}
      className={classNames('select2__input', className)}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      size={size}
      label=""
      clearable
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default SelectInput;
