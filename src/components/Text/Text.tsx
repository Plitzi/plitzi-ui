import classNames from 'classnames';

import DynamicComponent from '@/helpers/DynamicComponent';
import useTheme from '@hooks/useTheme';

import type TextStyles from './Text.styles';
import type { variantKeys } from './Text.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode } from 'react';

export type TextProps = {
  children?: ReactNode;
  as?: 'p' | 'b' | 'i' | 'u' | 'abbr' | 'cite' | 'del' | 'em' | 'ins' | 'kbd' | 'mark' | 's' | 'samp' | 'sub' | 'sup';
  isTruncated?: boolean;
  active?: boolean;
  testId?: string;
} & HTMLAttributes<HTMLElement> &
  useThemeSharedProps<typeof TextStyles, typeof variantKeys>;

const Text = ({
  className,
  children,
  as = 'p',
  isTruncated,
  active,
  testId,
  intent,
  size,
  weight,
  ...props
}: TextProps) => {
  className = useTheme<typeof TextStyles, typeof variantKeys>('Text', {
    className,
    componentKey: 'root',
    variant: { intent: active ? 'primary' : intent, size, weight }
  });

  return (
    <DynamicComponent
      {...props}
      tag={as}
      data-testid={testId}
      className={classNames(className, { truncate: isTruncated })}
    >
      {children}
    </DynamicComponent>
  );
};

export default Text;
