import useTheme from '@hooks/useTheme';

import type IconGroupStyles from './IconGroup.styles';
import type { variantKeys } from './IconGroup.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type IconSeparatorProps = useThemeSharedProps<typeof IconGroupStyles, typeof variantKeys>;

const IconSeparator = ({ className, intent, size, direction }: IconSeparatorProps) => {
  className = useTheme<typeof IconGroupStyles, typeof variantKeys>('IconGroup', {
    className,
    componentKey: 'separator',
    variants: { intent, size, direction }
  });

  return <div className={className} />;
};

export default IconSeparator;
