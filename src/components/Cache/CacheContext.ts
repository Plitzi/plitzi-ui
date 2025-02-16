import { createContext } from 'react';

export type CacheContextValue<T = unknown> = { cacheId: string } & Record<string, T>;

const cacheContextDefaultValue = {} as CacheContextValue;

const CacheContext = createContext<CacheContextValue>(cacheContextDefaultValue);

export default CacheContext;
