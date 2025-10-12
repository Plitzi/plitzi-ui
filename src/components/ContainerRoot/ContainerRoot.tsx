import { useEffect, useRef, useState } from 'react';

import ContainerRootProvider from './ContainerRootProvider';

import type { ReactNode } from 'react';

export type ContainerRootProps = { className?: string; children?: ReactNode; ssrMode?: boolean };

const ContainerRoot = ({ className = '', children, ssrMode = false, ...otherProps }: ContainerRootProps) => {
  const [rootDOM, setRootDOM] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    setRootDOM(ref.current);

    return () => {};
  }, []);

  if (ssrMode) {
    return (
      <div {...otherProps} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div {...otherProps} ref={ref} className={className}>
      <ContainerRootProvider rootDOM={rootDOM}>{children}</ContainerRootProvider>
    </div>
  );
};

export default ContainerRoot;
