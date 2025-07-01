import { useEffect } from 'react';

import type { ReactNode } from 'react';

export type ContainerShadowContentProps = {
  children?: ReactNode;
  contentDidMount?: () => void;
  contentDidDismount?: () => void;
};

const ContainerShadowContent = ({ children, contentDidMount, contentDidDismount }: ContainerShadowContentProps) => {
  useEffect(() => {
    contentDidMount?.();

    return () => {
      contentDidDismount?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default ContainerShadowContent;
