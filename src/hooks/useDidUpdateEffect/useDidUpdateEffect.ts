// Packages
import { useEffect, useRef } from 'react';

// Types
import type { DependencyList, EffectCallback } from 'react';

const useDidUpdateEffect = (callback: EffectCallback, dependencies: DependencyList) => {
  const isMountingRef = useRef(false);

  useEffect(() => {
    if (isMountingRef.current) {
      return callback();
    } else {
      isMountingRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useDidUpdateEffect;
