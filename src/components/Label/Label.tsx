import useTheme from '@hooks/useTheme';

import type LabelStyles from './Label.styles';
import type { variantKeys } from './Label.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode } from 'react';

export type LabelProps = {
  children?: ReactNode;
  disabled?: boolean;
  error?: boolean;
} & HTMLAttributes<HTMLLabelElement> &
  useThemeSharedProps<typeof LabelStyles, typeof variantKeys>;

const Label = ({ className, children, disabled = false, error = false, intent, size, ...labelProps }: LabelProps) => {
  className = useTheme<typeof LabelStyles, typeof variantKeys>('Label', {
    className,
    componentKey: 'root',
    variant: { intent, size, error, disabled }
  });

  return (
    <label className={className} {...labelProps}>
      {children}
    </label>
  );
};

export default Label;
