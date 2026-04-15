import type { SVGAttributes } from 'react';

const AlignSelfEndRow = (props: { [key: string]: unknown } & SVGAttributes<HTMLOrSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 16 16">
      <path fill="currentColor" d="M0 15h16v1H0zm6-9h4v8H6z" />
    </svg>
  );
};

export default AlignSelfEndRow;
