import { useEffect, useRef, useState } from 'react';

import ContainerRootProvider from './ContainerRootProvider';

import type { ReactNode } from 'react';

export type ContainerRootProps = { className?: string; children?: ReactNode; ssrMode?: boolean };

const ContainerRoot = ({ className = '', children, ...otherProps }: ContainerRootProps) => {
  const [rootDOM, setRootDOM] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    setRootDOM(ref.current);
  }, []);

  return (
    <div {...otherProps} ref={ref} className={className}>
      <ContainerRootProvider rootDOM={rootDOM}>{children}</ContainerRootProvider>
    </div>
  );
};

export default ContainerRoot;
