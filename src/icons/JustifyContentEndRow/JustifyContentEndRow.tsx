import type { SVGAttributes } from 'react';

const JustifyContentEndRow = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16">
    <path fill="currentColor" d="M15 0h1v16h-1z" />
    <path fill="currentColor" stroke="currentColor" d="M5.5 4.5h3v7h-3zm5 0h3v7h-3z" />
  </svg>
);

export default JustifyContentEndRow;
