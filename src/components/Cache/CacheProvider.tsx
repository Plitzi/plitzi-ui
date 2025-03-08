import { useMemo } from 'react';

import CacheContext from './CacheContext';

import type { ReactNode } from 'react';

export type CacheProviderProps = {
  children?: ReactNode;
  cacheId: string;
};

const CacheProvider = ({ children, cacheId = '' }: CacheProviderProps) => {
  const cacheMemo = useMemo(() => ({ cacheId }), [cacheId]);

  return <CacheContext value={cacheMemo}>{children}</CacheContext>;
};

export default CacheProvider;
