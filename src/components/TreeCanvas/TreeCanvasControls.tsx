import useTheme from '@hooks/useTheme';

import type TreeCanvasStyles from './TreeCanvas.styles';
import type { variantKeys } from './TreeCanvas.styles';

export type TreeCanvasControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
};

/** Zoom out, how far in it is, zoom in, and everything back in view. */
const TreeCanvasControls = ({ zoom, onZoomIn, onZoomOut, onFit }: TreeCanvasControlsProps) => {
  const classNameTheme = useTheme<typeof TreeCanvasStyles, typeof variantKeys>('TreeCanvas', {
    componentKey: ['controls', 'controlButton', 'zoomLabel']
  });

  return (
    <div className={classNameTheme.controls} onPointerDown={stopPropagation}>
      <button type="button" className={classNameTheme.controlButton} title="Zoom out (−)" onClick={onZoomOut}>
        <i className="fa-solid fa-minus" />
      </button>
      <span className={classNameTheme.zoomLabel}>{Math.round(zoom * 100)}%</span>
      <button type="button" className={classNameTheme.controlButton} title="Zoom in (+)" onClick={onZoomIn}>
        <i className="fa-solid fa-plus" />
      </button>
      <button type="button" className={classNameTheme.controlButton} title="Fit everything in view (0)" onClick={onFit}>
        <i className="fa-solid fa-expand" />
      </button>
    </div>
  );
};

// A press on the controls is not a press on the canvas behind them, which would start panning.
const stopPropagation = (e: { stopPropagation: () => void }) => e.stopPropagation();

export default TreeCanvasControls;
