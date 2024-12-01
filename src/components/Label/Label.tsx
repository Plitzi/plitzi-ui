// Alias
import useTheme from '@hooks/useTheme';

// Types
import type LabelStyles from './Label.styles';
import type { variantKeys } from './Label.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type LabelProps = {
  label?: string;
  disabled?: boolean;
  hasError?: boolean;
} & useThemeSharedProps<typeof LabelStyles, typeof variantKeys>;

const Label = ({ className, label, disabled = false, hasError = false, intent, size }: LabelProps) => {
  className = useTheme<typeof LabelStyles, typeof variantKeys>('Label', {
    className,
    componentKey: 'root',
    variant: { intent: disabled ? 'disabled' : hasError ? 'error' : intent, size }
  });

  return <label className={className}>{label}</label>;
};

export default Label;
