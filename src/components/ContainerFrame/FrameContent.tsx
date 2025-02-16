import { useEffect } from 'react';

import type { ReactNode } from 'react';

export type FrameContentProps = {
  children?: ReactNode;
  contentDidMount?: () => void;
  contentDidUpdate?: () => void;
  contentDidDismount?: () => void;
};

const FrameContent = ({ children, contentDidMount, contentDidDismount }: FrameContentProps) => {
  useEffect(() => {
    contentDidMount?.();

    return () => {
      contentDidDismount?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default FrameContent;
