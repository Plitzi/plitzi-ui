import { useCallback, useMemo } from 'react';

// Relatives
import ContainerRootContext from './ContainerRootContext';

import type { ReactNode } from 'react';

export type ContainerRootProviderProps = { rootDOM?: HTMLElement | null; children?: ReactNode };

const ContainerRootProvider = ({ children, rootDOM }: ContainerRootProviderProps) => {
  const getHost = useCallback(() => {
    if (rootDOM instanceof HTMLElement) {
      return rootDOM.getRootNode();
    }

    return undefined;
  }, [rootDOM]);

  const isRootShadow = useCallback(() => getHost() instanceof ShadowRoot, [getHost]);

  const rootContextMemo = useMemo(() => ({ getHost, rootDOM, isRootShadow }), [getHost, rootDOM, isRootShadow]);

  return <ContainerRootContext value={rootContextMemo}>{children}</ContainerRootContext>;
};

export default ContainerRootProvider;
