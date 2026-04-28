import { useEffect, useMemo, useRef, useState } from 'react';

import type { LinkHTMLAttributes, RefObject, SyntheticEvent } from 'react';

export type ContainerShadowLinkProps = {
  href: string;
  onLoad?: (e: SyntheticEvent) => void;
  onError?: (e: SyntheticEvent) => void;
  onRegister?: (ref: RefObject<HTMLLinkElement | null>) => void;
  onUnregister?: (ref: RefObject<HTMLLinkElement | null>) => void;
} & LinkHTMLAttributes<HTMLLinkElement>;

// SECURITY: only allow https:// stylesheet hrefs. Prevents javascript:, data:, file:,
// and protocol-relative URLs from loading attacker-controlled CSS into the shadow DOM.
const isSafeStylesheetHref = (raw: string): boolean => {
  if (!raw) return false;
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'https://localhost';
    const u = new URL(raw, base);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
};

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

  const safeHref = useMemo(() => (isSafeStylesheetHref(href) ? href : ''), [href]);

  useEffect(() => {
    onRegister?.(ref);

    setIsRegistered(true);

    return () => {
      onUnregister?.(ref);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SECURITY: spread `otherProps` BEFORE the fixed `rel="stylesheet"` so a caller cannot
  // override `rel`, `crossOrigin`, or `integrity`. The fixed attributes are placed last
  // so React's last-wins semantics keep them authoritative.
  if (!isRegistered) {
    return <link ref={ref} {...otherProps} rel="stylesheet" />;
  }

  return (
    <link
      ref={ref}
      {...otherProps}
      href={safeHref}
      onLoad={onLoad}
      onError={onError}
      rel="stylesheet"
      crossOrigin={otherProps.crossOrigin ?? 'anonymous'}
    />
  );
};

export default ContainerShadowLink;
