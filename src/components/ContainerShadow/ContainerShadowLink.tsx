import { useEffect, useRef, useState } from 'react';

import type { LinkHTMLAttributes, RefObject, SyntheticEvent } from 'react';

export type ContainerShadowLinkProps = {
  href: string;
  onLoad?: (e: SyntheticEvent) => void;
  onError?: (e: SyntheticEvent) => void;
  onRegister?: (ref: RefObject<HTMLLinkElement | null>) => void;
  onUnregister?: (ref: RefObject<HTMLLinkElement | null>) => void;
} & LinkHTMLAttributes<HTMLLinkElement>;

const ContainerShadowLink = ({
  href,
  onLoad,
  onError,
  onRegister,
  onUnregister,
  ...otherProps
}: ContainerShadowLinkProps) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const ref = useRef<HTMLLinkElement>(null);

  useEffect(() => {
    onRegister?.(ref);
    setIsRegistered(true);

    return () => {
      onUnregister?.(ref);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isRegistered) {
    return <link ref={ref} rel="stylesheet" {...otherProps} />;
  }

  return <link ref={ref} href={href} onLoad={onLoad} onError={onError} rel="stylesheet" {...otherProps} />;
};

export default ContainerShadowLink;
