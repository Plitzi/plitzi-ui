import type { SVGAttributes } from 'react';

const AlignSelfStartRow = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 16 16">
      <path fill="currentColor" d="M0 0h16v1H0zm6 2h4v8H6z" />
    </svg>
  );
};

export default AlignSelfStartRow;
