// Alias
import useTheme from '@hooks/useTheme';

// Types
import type CheckboxStyles from './Checkbox.styles';
import type { variantKeys } from './Checkbox.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

// Types
import type { Ref, InputHTMLAttributes } from 'react';

export type CheckboxProps = {
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  useThemeSharedProps<typeof CheckboxStyles, typeof variantKeys>;

const Checkbox = ({ ref, className = '', error = false, size, intent, ...inputProps }: CheckboxProps) => {
  className = useTheme<typeof CheckboxStyles, typeof variantKeys>('Checkbox', {
    className,
    componentKey: 'input',
    variant: { intent: error ? 'danger' : intent, size }
  });

  return <input type="checkbox" ref={ref} className={className} {...inputProps} />;
};

export default Checkbox;
