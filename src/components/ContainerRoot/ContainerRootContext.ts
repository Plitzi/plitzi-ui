// Packages
import { createContext } from 'react';

export type ContainerRootContextValue = {
  rootDOM?: HTMLElement | null;
  getHost: () => Node | undefined;
  isRootShadow: () => boolean;
};

const ContainerRootContext = createContext({} as ContainerRootContextValue);

export default ContainerRootContext;
