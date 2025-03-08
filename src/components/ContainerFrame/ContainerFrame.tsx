import { Children, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useTheme from '@hooks/useTheme';

import FrameContent from './FrameContent';
import { emptyObject } from '../../helpers/utils';

import type ContainerFrameStyles from './ContainerFrame.styles';
import type { variantKeys } from './ContainerFrame.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode, RefObject } from 'react';

export type Asset = {
  type: string;
  params: { [key: string]: string };
};

export type ContainerFrameProps = {
  ref: RefObject<HTMLIFrameElement>;
  ssrMode?: boolean;
  id?: string;
  css?: string;
  style?: CSSProperties;
  zoom?: number;
  assets?: { [key: string]: Asset };
  viewport?: string;
  children?: ReactNode;
  contentDidMount?: () => void;
  contentDidDismount?: () => void;
  contentDidUpdate?: () => void;
} & useThemeSharedProps<typeof ContainerFrameStyles, typeof variantKeys>;

const ContainerFrame = ({
  ref,
  className = '',
  ssrMode = false,
  id = '',
  css = '',
  style = emptyObject,
  zoom = 1.0,
  assets = emptyObject,
  viewport = 'width=device-width, initial-scale=1',
  children,
  contentDidMount: contentDidMountProp,
  contentDidDismount,
  contentDidUpdate
}: ContainerFrameProps) => {
  className = useTheme<typeof ContainerFrameStyles, typeof variantKeys>('ContainerFrame', {
    className,
    componentKey: 'root',
    variant: {}
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useImperativeHandle<HTMLIFrameElement | null, HTMLIFrameElement | null>(ref, () => iframeRef.current, [iframeRef]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const document = useMemo(() => {
    if (!iframeLoaded || !iframeRef.current) {
      return undefined;
    }

    return iframeRef.current.contentDocument;
  }, [iframeLoaded]);

  const loadAssets = useCallback((assets: { [key: string]: Asset }, head: HTMLHeadElement, document: Document) => {
    const assetsLoaded = [...head.childNodes];
    const customStyleElement = document.getElementById('customStyle');
    Object.values(assets).forEach(asset => {
      const newAsset = document.createElement(asset.type) as HTMLLinkElement | HTMLScriptElement;
      Object.keys(asset.params).forEach(key => {
        if (asset.type === 'link') {
          (newAsset as HTMLLinkElement).setAttribute(key, asset.params[key]);
        } else if (asset.type === 'script') {
          (newAsset as HTMLScriptElement).setAttribute(key, asset.params[key]);
        }
      });
      if (
        !assetsLoaded.find(
          node =>
            (node as HTMLLinkElement).href === (newAsset as HTMLLinkElement).href ||
            (node as HTMLScriptElement).src === (newAsset as HTMLScriptElement).src
        )
      ) {
        head.insertBefore(newAsset, customStyleElement);
      }
    });
  }, []);

  const loadBuilderAssets = useCallback(
    (document: Document, assets: { [key: string]: Asset }) => {
      const { head } = document;
      const headChildren = head.querySelectorAll('*:not([asset-static="true"])');
      Object.values(headChildren).forEach(node => {
        head.removeChild(node);
      });

      loadAssets(assets, head, document);
    },
    [loadAssets]
  );

  const getAssetsAsString = (assets: { [key: string]: Asset }) => {
    const assetsCache: string[] = [];
    Object.values(assets).forEach(asset => {
      assetsCache.push(
        `<${asset.type} ${Object.keys(asset.params)
          .map(param => `${param}="${asset.params[param]}"`)
          .join(' ')}>`
      );
    });

    return assetsCache.join('');
  };

  const [initialHead] = useState(() => getAssetsAsString(assets));

  const contentDidMount = () => contentDidMountProp?.();

  useEffect(() => {
    if (iframeLoaded && document) {
      loadBuilderAssets(document, assets);
    }
  }, [iframeLoaded, assets, document, loadBuilderAssets]);

  const handleLoad = useCallback(() => {
    if (iframeLoaded) {
      return;
    }

    setIframeLoaded(true);
  }, [iframeLoaded]);

  if (document) {
    document.body.style.zoom = `${zoom}`;
  }

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title="#"
      srcDoc={`<!DOCTYPE html><html><head>${initialHead}</head><body></body></html>`}
      id={id}
      onLoad={handleLoad}
      style={style}
    >
      {iframeLoaded &&
        document &&
        createPortal(
          <>
            <meta name="viewport" content={viewport} asset-static="true" />
            {!ssrMode && (
              <style id="customStyle" asset-static="true">
                {css}
              </style>
            )}
            {ssrMode && <style id="customStyle" asset-static="true" dangerouslySetInnerHTML={{ __html: css }} />}
          </>,
          document.head
        )}
      {iframeLoaded &&
        document &&
        children &&
        createPortal(
          <FrameContent
            contentDidMount={contentDidMount}
            contentDidDismount={contentDidDismount}
            contentDidUpdate={contentDidUpdate}
          >
            {Children.only(children)}
          </FrameContent>,
          document.body
        )}
    </iframe>
  );
};

export default ContainerFrame;
