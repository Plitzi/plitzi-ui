import { useRef } from 'react';

import type { StyleHTMLAttributes } from 'react';

export type ContainerShadowStyleProps = {
  children: string;
} & StyleHTMLAttributes<HTMLLinkElement>;

const ContainerShadowStyle = ({ children, ...otherProps }: ContainerShadowStyleProps) => {
  const ref = useRef<HTMLLinkElement>(null);

  return (
    <style ref={ref} {...otherProps}>
      {children}
    </style>
  );
};

export default ContainerShadowStyle;
