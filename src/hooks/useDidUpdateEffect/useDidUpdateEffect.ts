// Packages
import { useEffect, useRef } from 'react';

// Types
import type { DependencyList, EffectCallback } from 'react';

export type UpdateEffectCallback = EffectCallback | ((prevDependencies: DependencyList) => void);

const useDidUpdateEffect = (
  callback: UpdateEffectCallback,
  dependencies: DependencyList,
  asEffect: boolean = false
) => {
  const isMountingRef = useRef(asEffect);
  const prevDependencies = useRef(dependencies);

  useEffect(() => {
    if (isMountingRef.current) {
      const prevState = prevDependencies.current;
      prevDependencies.current = dependencies;

      return callback(prevState);
    }

    isMountingRef.current = true;
    prevDependencies.current = dependencies;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useDidUpdateEffect;
