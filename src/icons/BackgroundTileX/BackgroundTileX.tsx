import type { SVGAttributes } from 'react';

const BackgroundTileX = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16">
    <path fill="currentColor" d="M1 6h4v4H1zm5 0h4v4H6zm5 0h4v4h-4z" />
  </svg>
);

export default BackgroundTileX;
