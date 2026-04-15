import type { SVGAttributes } from 'react';

const BorderStyleSolid = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16">
    <path fill="currentColor" d="M1 7h14v2H1z" />
  </svg>
);

export default BorderStyleSolid;
