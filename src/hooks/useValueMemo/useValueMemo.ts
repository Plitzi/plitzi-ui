import { useRef } from 'react';

import deepEqual from '@/utils/deepEqual';

import type { DeepEqualMetadata } from '@/utils/deepEqual';

const useValueMemo = <T = unknown>(value: T, mode: 'soft' | 'hard' = 'soft', metadata: DeepEqualMetadata = {}): T => {
  const valueRef = useRef<T>(value);
  if (deepEqual(valueRef.current, value, mode, metadata)) {
    return valueRef.current;
  }

  valueRef.current = value;

  return value;
};

export default useValueMemo;
