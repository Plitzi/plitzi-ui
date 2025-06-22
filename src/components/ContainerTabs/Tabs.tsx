import useTheme from '@hooks/useTheme';

import Tab from './Tab';

import type ContainerTabsStyles from './ContainerTabs.styles';
import type { variantKeys } from './ContainerTabs.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type TabItem = { label: string };

export type TabsProps = {
  items?: TabItem[];
  tabSelected?: number;
  onSelect?: (index: number) => void;
} & useThemeSharedProps<typeof ContainerTabsStyles, typeof variantKeys>;

const Tabs = ({ className, items = [], tabSelected = 0, onSelect }: TabsProps) => {
  className = useTheme<typeof ContainerTabsStyles, typeof variantKeys>('ContainerTabs', {
    className,
    componentKey: 'tabs'
  });

  return (
    <div className={className}>
      {items.map((item: TabItem, i: number) => (
        <Tab key={i} label={item.label} active={tabSelected === i} index={i} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default Tabs;
