// Relatives
import Card from '../Card';

import type { CardProps } from '@components/Card';
import type { ReactNode } from 'react';

type ContainerFloatingContainerProps = {
  className?: string;
  children: ReactNode;
  shadow?: CardProps['shadow'];
};

const ContainerFloatingContainer = ({ className = '', children, shadow }: ContainerFloatingContainerProps) => {
  return (
    <div className={className}>
      <Card className="overflow-y-auto" shadow={shadow}>
        {children}
      </Card>
    </div>
  );
};

export default ContainerFloatingContainer;
