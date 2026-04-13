import { useCallback, useMemo, useRef } from 'react';

import ContainerRootContext from './ContainerRootContext';

import type { ReactNode } from 'react';

export type ContainerRootProps = { className?: string; children?: ReactNode; ssrMode?: boolean };

const ContainerRoot = ({ className = '', children, ...otherProps }: ContainerRootProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const getHost = useCallback(() => {
    return rootRef.current instanceof HTMLElement ? rootRef.current.getRootNode() : undefined;
  }, [rootRef]);

  const isRootShadow = useCallback(() => getHost() instanceof ShadowRoot, [getHost]);

  const rootContextMemo = useMemo(() => ({ getHost, rootRef, isRootShadow }), [getHost, rootRef, isRootShadow]);

  return (
    <div {...otherProps} ref={rootRef} className={className}>
      <ContainerRootContext value={rootContextMemo}>{children}</ContainerRootContext>
    </div>
  );
};

export default ContainerRoot;
