// Alias
import useTheme from '@hooks/useTheme';

// Types
import type CardStyles from './Card.styles';
import type { variantKeys } from './Card.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type CardProps = {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof CardStyles, typeof variantKeys>;

const Card = ({ ref, className, children, intent, size, shadow, rounded, overflow, ...otherProps }: CardProps) => {
  className = useTheme<typeof CardStyles, typeof variantKeys>('Card', {
    className,
    componentKey: 'root',
    variant: { intent, size, shadow, rounded, overflow }
  });

  return (
    <div ref={ref} {...otherProps} className={className}>
      {children}
    </div>
  );
};

export default Card;
