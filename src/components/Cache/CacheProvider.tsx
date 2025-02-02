// Packages
import { useMemo } from 'react';

// Relatives
import CacheContext from './CacheContext';

// Types
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
