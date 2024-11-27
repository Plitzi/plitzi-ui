// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type IconGroupStyles from './IconGroup.styles';
import type { variantKeys } from './IconGroup.styles';

export type IconSeparatorProps = useThemeSharedProps<typeof IconGroupStyles, typeof variantKeys>;

const IconSeparator = ({ className, intent, size, direction }: IconSeparatorProps) => {
  className = useTheme<typeof IconGroupStyles, typeof variantKeys>('IconGroup', {
    className,
    componentKey: 'separator',
    variant: { intent, size, direction }
  });

  return <div className={className} />;
};

export default IconSeparator;
