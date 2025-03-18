import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

import type CheckboxStyles from './Checkbox.styles';
import type { variantKeys } from './Checkbox.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { RefObject, InputHTMLAttributes } from 'react';

export type CheckboxProps = {
  ref?: RefObject<HTMLInputElement>;
  label?: string;
  error?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  useThemeSharedProps<typeof CheckboxStyles, typeof variantKeys>;

const Checkbox = ({ ref, className = '', label = '', error = false, size, intent, ...inputProps }: CheckboxProps) => {
  const classNameTheme = useTheme<typeof CheckboxStyles, typeof variantKeys>('Checkbox', {
    className,
    componentKey: ['root', 'input'],
    variant: { intent: error ? 'danger' : intent, size }
  });

  return (
    <Label className={classNameTheme.root} size={size}>
      <input type="checkbox" ref={ref} className={classNameTheme.input} {...inputProps} />
      {label}
    </Label>
  );
};

export default Checkbox;
