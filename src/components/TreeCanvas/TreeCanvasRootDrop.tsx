import useTheme from '@hooks/useTheme';

import type TreeCanvasStyles from './TreeCanvas.styles';
import type { variantKeys } from './TreeCanvas.styles';
import type { Ref } from 'react';

export type TreeCanvasRootDropProps = {
  ref?: Ref<HTMLDivElement>;
  /** Whether the dragged item is over it now. */
  active: boolean;
  label: string;
};

/** Where to drop an item to take it out of every container: shown only while one that lives in one is dragged. */
const TreeCanvasRootDrop = ({ ref, active, label }: TreeCanvasRootDropProps) => {
  const className = useTheme<typeof TreeCanvasStyles, typeof variantKeys>('TreeCanvas', {
    componentKey: 'rootDrop',
    variants: { active }
  });

  return (
    <div ref={ref} className={className}>
      <i className="fa-solid fa-arrow-up" />
      {label}
    </div>
  );
};

export default TreeCanvasRootDrop;
