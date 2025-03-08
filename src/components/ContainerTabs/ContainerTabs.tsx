import { Children, useCallback, useMemo, useState, cloneElement, isValidElement } from 'react';

import useTheme from '@hooks/useTheme';

import TabContent from './TabContent';
import Tabs from './Tabs';

import type ContainerTabsStyles from './ContainerTabs.styles';
import type { variantKeys } from './ContainerTabs.styles';
import type { TabContentProps } from './TabContent';
import type { TabsProps } from './Tabs';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactElement } from 'react';

export type ContainerTabsProps = {
  children?: React.ReactNode;
} & useThemeSharedProps<typeof ContainerTabsStyles, typeof variantKeys>;

const ContainerTabs = ({ children, className }: ContainerTabsProps) => {
  className = useTheme<typeof ContainerTabsStyles, typeof variantKeys>('ContainerTabs', {
    className,
    componentKey: 'root',
    variant: {}
  });
  const [tabSelected, setTabSelected] = useState(0);

  const handleSelect = useCallback((index: number) => setTabSelected(index), []);

  const { tabs, content } = useMemo(() => {
    const components = {
      tabs: <Tabs tabSelected={tabSelected} onSelect={handleSelect} />,
      content: <TabContent />
    };

    let contentIndex = 0;
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Tabs) {
        const tabsProps = child.props as TabsProps;
        components.tabs = cloneElement<TabsProps>(child as ReactElement<TabsProps>, {
          ...tabsProps,
          key: 'tabs',
          tabSelected,
          onSelect: handleSelect
        });
      } else if (child.type === TabContent && contentIndex++ === tabSelected) {
        const tabsProps = child.props as TabContentProps;
        components.content = cloneElement<TabContentProps>(child as ReactElement<TabContentProps>, {
          ...tabsProps,
          key: `content-${tabSelected}`
        });
      }
    });

    return components;
  }, [children, tabSelected, handleSelect]);

  return (
    <div className={className}>
      {tabs}
      {content}
    </div>
  );
};

ContainerTabs.Tabs = Tabs;

ContainerTabs.TabContent = TabContent;

export default ContainerTabs;
