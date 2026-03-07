import { useCallback, useMemo } from 'react';

import ContainerRootContext from './ContainerRootContext';

import type { ReactNode, RefObject } from 'react';

export type ContainerRootProviderProps = { rootRef: RefObject<HTMLDivElement | null>; children?: ReactNode };

const ContainerRootProvider = ({ children, rootRef }: ContainerRootProviderProps) => {
  const getHost = useCallback(() => {
    if (rootRef.current instanceof HTMLElement) {
      return rootRef.current.getRootNode();
    }

    return undefined;
  }, [rootRef]);

  const isRootShadow = useCallback(() => getHost() instanceof ShadowRoot, [getHost]);

  const rootContextMemo = useMemo(() => ({ getHost, rootRef, isRootShadow }), [getHost, rootRef, isRootShadow]);

  return <ContainerRootContext value={rootContextMemo}>{children}</ContainerRootContext>;
};

export default ContainerRootProvider;
