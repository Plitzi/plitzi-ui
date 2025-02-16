import { createContext } from 'react';

export type SidebarContextValue = {
  onChange?: (id: string) => void;
};

const sidebarDefaultValue = {
  onChange: undefined
};

const SidebarContext = createContext<SidebarContextValue>(sidebarDefaultValue);

export default SidebarContext;
