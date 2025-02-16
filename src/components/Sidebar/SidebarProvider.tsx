import { useMemo } from 'react';

// Relatives
import SidebarContext from './SidebarContext';

import type { SidebarContextValue } from './SidebarContext';
import type { ReactNode } from 'react';

export type SidebarProviderProps = {
  children?: ReactNode;
} & SidebarContextValue;

const SidebarProvider = ({ children, onChange }: SidebarProviderProps) => {
  const sidebarContextValue = useMemo(() => ({ onChange }), [onChange]);

  return <SidebarContext value={sidebarContextValue}>{children}</SidebarContext>;
};

export default SidebarProvider;
