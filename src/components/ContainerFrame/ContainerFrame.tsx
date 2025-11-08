import { Children, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useTheme from '@hooks/useTheme';

import FrameContent from './FrameContent';
import { emptyObject } from '../../helpers/utils';

import type ContainerFrameStyles from './ContainerFrame.styles';
import type { variantKeys } from './ContainerFrame.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode, RefObject } from 'react';

export type Asset = { id?: string; type: string; params: Record<string, string> };

export type ContainerFrameProps = {
  ref?: RefObject<HTMLIFrameElement | null>;
  ssrMode?: boolean;
  id?: string;
  css?: string;
  style?: CSSProperties;
  zoom?: number;
  assets?: Record<string, Asset>;
  viewport?: string;
  children?: ReactNode;
  contentDidMount?: () => void;
  contentDidDismount?: () => void;
  contentDidUpdate?: () => void;
  onLoad?: (iframe: HTMLIFrameElement | null) => void;
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
  contentDidUpdate,
  onLoad
}: ContainerFrameProps) => {
  className = useTheme<typeof ContainerFrameStyles, typeof variantKeys>('ContainerFrame', {
    className,
    componentKey: 'root'
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useImperativeHandle<HTMLIFrameElement | null, HTMLIFrameElement | null>(ref, () => iframeRef.current, [iframeRef]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const myDocument = useMemo(() => {
    if (!iframeLoaded) {
      return undefined;
    }

    return iframeRef.current?.contentDocument;
  }, [iframeLoaded]);

  const loadAssets = useCallback((assets: Record<string, Asset>, head: HTMLHeadElement, documentInstance: Document) => {
    const assetsLoaded = [...head.childNodes];
    const customStyleElement = documentInstance.getElementById('customStyle');
    Object.values(assets).forEach(asset => {
      const newAsset = documentInstance.createElement(asset.type) as HTMLLinkElement | HTMLScriptElement;
      if (asset.id) {
        newAsset.setAttribute('data-id', asset.id);
      }

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
            (asset.type === 'link' && (node as HTMLLinkElement).href === (newAsset as HTMLLinkElement).href) ||
            (asset.type === 'script' && (node as HTMLScriptElement).src === (newAsset as HTMLScriptElement).src)
        )
      ) {
        head.insertBefore(newAsset, customStyleElement);
        assetsLoaded.push(newAsset);
      }
    });
  }, []);

  const loadBuilderAssets = useCallback(
    (documentInstance: Document, assets: { [key: string]: Asset }) => {
      const { head } = documentInstance;
      const headChildren = head.querySelectorAll('*:not([asset-static="true"])');
      Object.values(headChildren).forEach(node => {
        head.removeChild(node);
      });

      loadAssets(assets, head, documentInstance);
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

  const contentDidMount = useCallback(() => contentDidMountProp?.(), [contentDidMountProp]);

  useEffect(() => {
    if (iframeLoaded && myDocument) {
      loadBuilderAssets(myDocument, assets);
    }
  }, [iframeLoaded, assets, myDocument, loadBuilderAssets]);

  const handleLoad = useCallback(() => {
    if (iframeLoaded) {
      return;
    }

    onLoad?.(iframeRef.current);
    setIframeLoaded(true);
  }, [iframeLoaded, onLoad]);

  useEffect(() => {
    if (myDocument) {
      // eslint-disable-next-line react-hooks/immutability
      myDocument.body.style.zoom = `${zoom}`;
    }
  }, [myDocument, zoom]);

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
        myDocument &&
        createPortal(
          <>
            <meta name="viewport" content={viewport} asset-static="true" />
            {!ssrMode && css && (
              <style id="customStyle" asset-static="true">
                {css}
              </style>
            )}
            {ssrMode && css && <style id="customStyle" asset-static="true" dangerouslySetInnerHTML={{ __html: css }} />}
          </>,
          myDocument.head
        )}
      {iframeLoaded &&
        myDocument &&
        children &&
        createPortal(
          <FrameContent
            contentDidMount={contentDidMount}
            contentDidDismount={contentDidDismount}
            contentDidUpdate={contentDidUpdate}
          >
            {Children.only(children)}
          </FrameContent>,
          myDocument.body
        )}
    </iframe>
  );
};

export default ContainerFrame;
