import type { SVGAttributes } from 'react';

const BorderStyleDashed = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16">
    <path fill="currentColor" d="M0 7h4v2H0zm6 0h4v2H6zm6 0h4v2h-4z" />
  </svg>
);

export default BorderStyleDashed;
