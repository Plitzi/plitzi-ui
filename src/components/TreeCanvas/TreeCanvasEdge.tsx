import useTheme from '@hooks/useTheme';

import type TreeCanvasStyles from './TreeCanvas.styles';
import type { variantKeys } from './TreeCanvas.styles';

export type TreeCanvasEdgeProps = {
  path: string;
  /** On the way to the selected item, or out of it. */
  highlighted: boolean;
  dimmed: boolean;
};

const TreeCanvasEdge = ({ path, highlighted, dimmed }: TreeCanvasEdgeProps) => {
  const className = useTheme<typeof TreeCanvasStyles, typeof variantKeys>('TreeCanvas', {
    componentKey: 'edge',
    variants: { highlighted, dimmed }
  });

  return <path className={className} d={path} />;
};

export default TreeCanvasEdge;
