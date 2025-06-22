import { useCallback } from 'react';

import useTheme from '@hooks/useTheme';

import type ContainerTabsStyles from './ContainerTabs.styles';
import type { variantKeys } from './ContainerTabs.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type TabProps = {
  label?: ReactNode;
  active?: boolean;
  index?: number;
  onSelect?: (index: number) => void;
} & useThemeSharedProps<typeof ContainerTabsStyles, typeof variantKeys>;

const Tab = ({ className, label = 'Tab Name', active, index = 0, onSelect }: TabProps) => {
  className = useTheme<typeof ContainerTabsStyles, typeof variantKeys>('ContainerTabs', {
    className,
    componentKey: 'tab',
    variants: { active }
  });

  const handleClick = useCallback(() => onSelect?.(index), [index, onSelect]);

  return (
    <div className={className} onClick={handleClick}>
      {label}
    </div>
  );
};

export default Tab;
