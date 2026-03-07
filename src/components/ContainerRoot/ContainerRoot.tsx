import { useRef } from 'react';

import ContainerRootProvider from './ContainerRootProvider';

import type { ReactNode } from 'react';

export type ContainerRootProps = { className?: string; children?: ReactNode; ssrMode?: boolean };

const ContainerRoot = ({ className = '', children, ...otherProps }: ContainerRootProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div {...otherProps} ref={ref} className={className}>
      <ContainerRootProvider rootRef={ref}>{children}</ContainerRootProvider>
    </div>
  );
};

export default ContainerRoot;
