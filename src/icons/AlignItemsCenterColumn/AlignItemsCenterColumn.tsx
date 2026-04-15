import type { SVGAttributes } from 'react';

const AlignItemsCenterColumn = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16">
    <path fill="currentColor" stroke="currentColor" d="M3.5 3.5h8v3h-8zm1 5h6v3h-6z" />
    <path fill="currentColor" d="M7 0h1v16H7z" />
  </svg>
);

export default AlignItemsCenterColumn;
