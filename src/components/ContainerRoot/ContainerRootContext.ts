import { createContext } from 'react';

import type { RefObject } from 'react';

export type ContainerRootContextValue = {
  rootRef: RefObject<HTMLDivElement | null>;
  getHost: () => Node | undefined;
  isRootShadow: () => boolean;
};

const ContainerRootContext = createContext({} as ContainerRootContextValue);
ContainerRootContext.displayName = 'ContainerRootContext';

export default ContainerRootContext;
