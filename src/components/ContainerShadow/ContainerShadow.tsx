import {
  useEffect,
  useRef,
  useState,
  useMemo,
  isValidElement,
  cloneElement,
  Children,
  useImperativeHandle
} from 'react';
import { createPortal } from 'react-dom';
// import createCache from '@emotion/cache';
// import { CacheProvider } from '@emotion/react';

import ContainerShadowContent from './ContainerShadowContent';
import ContainerShadowContext from './ContainerShadowContext';
import ContainerShadowLink from './ContainerShadowLink';
import ContainerShadowStyle from './ContainerShadowStyle';

import type { ContainerShadowContentProps } from './ContainerShadowContent';
import type { ContainerShadowLinkProps } from './ContainerShadowLink';
import type { ContainerShadowStyleProps } from './ContainerShadowStyle';
import type { ReactElement, ReactNode, RefObject, SyntheticEvent } from 'react';

export type ContainerShadowProps = {
  ref?: RefObject<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
  mode?: 'open' | 'closed';
  delegatesFocus?: boolean;
  stylesheets?: CSSStyleSheet[];
  fallback?: ReactNode;
};

const ContainerShadow = ({
  ref,
  className = '',
  children,
  mode = 'open',
  delegatesFocus = false,
  stylesheets,
  fallback
}: ContainerShadowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => containerRef.current, [containerRef]);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const [rootInitialized, setRootInitialized] = useState(false);
  // const [emotionCache, setEmotionCache] = useState(undefined);

  const linkRegister = (ref: RefObject<HTMLLinkElement | null>) => {
    setLinksLoading(state => {
      if (!ref.current) {
        return state;
      }

      const newPendings = [...state.pending, ref.current];

      return { isLoading: newPendings.length > 0, pending: newPendings };
    });
  };

  const linkUnregister = (ref: RefObject<HTMLLinkElement | null>) => {
    setLinksLoading(state => {
      const newPendings = state.pending.filter(link => link !== ref.current);

      return { isLoading: newPendings.length > 0, pending: newPendings };
    });
  };

  const linkLoaded = (e: SyntheticEvent) => {
    setLinksLoading(state => {
      const newPendings = state.pending.filter(link => link !== e.target);

      return { isLoading: newPendings.length > 0, pending: newPendings };
    });
  };

  const linkError = (e: SyntheticEvent) => {
    setLinksLoading(state => {
      const newPendings = state.pending.filter(link => link !== e.target);

      return { isLoading: newPendings.length > 0, pending: newPendings };
    });
  };

  const contentDidMount = () => {};

  const { content, links, styles } = useMemo(() => {
    const components = {
      content: <ContainerShadowContent key="shadow-content" />,
      links: [] as ReactNode[],
      styles: [] as ReactNode[]
    };

    Children.forEach(children, (child, i) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ContainerShadowContent) {
        components.content = cloneElement<ContainerShadowContentProps>(
          child as ReactElement<ContainerShadowContentProps>,
          { ...(child.props as ContainerShadowContentProps), key: 'shadow-content', contentDidMount }
        );
      } else if (child.type === ContainerShadowLink) {
        components.links.push(
          cloneElement<ContainerShadowLinkProps>(child as ReactElement<ContainerShadowLinkProps>, {
            ...(child.props as ContainerShadowLinkProps),
            key: i,
            onRegister: linkRegister,
            onUnregister: linkUnregister,
            onLoad: linkLoaded,
            onError: linkError
          })
        );
      } else if (child.type === ContainerShadowStyle) {
        components.content = cloneElement<ContainerShadowStyleProps>(child as ReactElement<ContainerShadowStyleProps>, {
          ...(child.props as ContainerShadowStyleProps),
          key: i
        });
      }
    });

    return components;
  }, [children]);

  const [linksLoading, setLinksLoading] = useState<{ isLoading: boolean; pending: HTMLLinkElement[] }>({
    isLoading: links.length !== 0,
    pending: []
  });

  useEffect(() => {
    if (containerRef.current) {
      const shadow = containerRef.current.attachShadow({ mode, delegatesFocus });
      if (stylesheets) {
        shadow.adoptedStyleSheets = stylesheets;
      }

      // setEmotionCache(
      //   createCache({
      //     container: shadow,
      //     key: 'plitzi',
      //     prepend: false
      //   })
      // );
      setShadowRoot(shadow);
      setRootInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shadowContextMemo = useMemo(() => ({ shadowRoot }), [shadowRoot]);
  const { isLoading } = linksLoading;

  return (
    <div ref={containerRef} className={className}>
      {rootInitialized &&
        shadowRoot &&
        createPortal(
          <ContainerShadowContext value={shadowContextMemo}>
            {links}
            {styles}
            {!isLoading && content}
            {isLoading && fallback}
          </ContainerShadowContext>,
          shadowRoot
        )}
    </div>
  );

  // return (
  //   <div className={className}>
  //     {createPortal(<CacheProvider value={emotionCache}>{children}</CacheProvider>, shadowRoot)}
  //   </div>
  // );
};

ContainerShadow.Content = ContainerShadowContent;

ContainerShadow.Link = ContainerShadowLink;
ContainerShadow.Style = ContainerShadowStyle;

export default ContainerShadow;
