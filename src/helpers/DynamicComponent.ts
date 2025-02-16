import { createElement } from 'react';

import type { ReactNode, JSX } from 'react';

export type DynamicComponentProps = {
  children?: ReactNode;
  tag: keyof JSX.IntrinsicElements;
  [key: string]: unknown;
};

const DynamicComponent = ({ tag, children, ...props }: DynamicComponentProps) => createElement(tag, props, children);

export default DynamicComponent;
