// Types
import type { ReactNode } from 'react';

export type ContainerFloatingContentProps = {
  children?: ReactNode;
  className?: string;
};

const ContainerFloatingContent = ({
  children,
  className = 'flex w-full h-full items-center'
}: ContainerFloatingContentProps) => {
  return <div className={className}>{children}</div>;
};

export default ContainerFloatingContent;
