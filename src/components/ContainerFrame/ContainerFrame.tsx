import { Children, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useTheme from '@hooks/useTheme';

import FrameContent from './FrameContent';

import type ContainerFrameStyles from './ContainerFrame.styles';
import type { variantKeys } from './ContainerFrame.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode, RefObject } from 'react';

export type Asset = { id?: string; type: string; params: Record<string, string> };

// SECURITY: tight allowlists for assets injected into the iframe srcdoc/head.
// Without these, attacker-controlled CMS content reaches `setAttribute(key, val)` and
// the srcdoc HTML string, enabling XSS via `onload`/`onerror` handlers, javascript: URLs,
// and HTML breakouts in attribute values.
const ALLOWED_ASSET_TYPES = new Set(['link', 'script']);
const ALLOWED_LINK_KEYS = new Set(['rel', 'href', 'type', 'integrity', 'crossorigin', 'as', 'media', 'referrerpolicy']);
const ALLOWED_SCRIPT_KEYS = new Set([
  'src',
  'type',
  'integrity',
  'crossorigin',
  'async',
  'defer',
  'nomodule',
  'referrerpolicy'
]);
const SAFE_URL_KEYS = new Set(['href', 'src']);

const isSafeAssetUrl = (raw: string): boolean => {
  if (!raw) return false;
  try {
    const u = new URL(raw, window.location.href);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

const allowedKeysFor = (type: string): Set<string> | null => {
  if (type === 'link') return ALLOWED_LINK_KEYS;
  if (type === 'script') return ALLOWED_SCRIPT_KEYS;
  return null;
};

const sanitizeAsset = (asset: Asset): Asset | null => {
  if (!asset || typeof asset.type !== 'string' || !ALLOWED_ASSET_TYPES.has(asset.type)) {
    return null;
  }

  const allowed = allowedKeysFor(asset.type);
  if (!allowed) return null;

  const cleanParams: Record<string, string> = {};
  for (const [rawKey, rawVal] of Object.entries(asset.params || {})) {
    const key = rawKey.toLowerCase();
    if (!allowed.has(key)) continue;
    const val = String(rawVal ?? '');
    if (SAFE_URL_KEYS.has(key) && !isSafeAssetUrl(val)) continue;
    cleanParams[key] = val;
  }

  return { id: asset.id, type: asset.type, params: cleanParams };
};

const sanitizeAssets = (assets?: Record<string, Asset>): Record<string, Asset> | undefined => {
  if (!assets) return undefined;
  const out: Record<string, Asset> = {};
  for (const [k, v] of Object.entries(assets)) {
    const cleaned = sanitizeAsset(v);
    if (cleaned) out[k] = cleaned;
  }

  return out;
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// CSS sanitizer for ssrMode: strip </style> sequences and any obvious script-injection chars
// to prevent escaping the <style> context inside the srcdoc.
const sanitizeCss = (css: string): string =>
  css.replace(/<\/style/gi, '<\\/style').replace(/<!--/g, '').replace(/-->/g, '');

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
  style,
  zoom = 1,
  assets,
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
  const [myDocument, setMyDocument] = useState<Document | null | undefined>(null);

  // Sanitize incoming assets ONCE per change. All downstream code must use safeAssets.
  const safeAssets = useMemo(() => sanitizeAssets(assets), [assets]);
  const safeCss = useMemo(() => (typeof css === 'string' ? sanitizeCss(css) : ''), [css]);

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
    (documentInstance: Document, assets?: Record<string, Asset>) => {
      const { head } = documentInstance;
      const headChildren = head.querySelectorAll('*:not([asset-static="true"])');
      Object.values(headChildren).forEach(node => {
        head.removeChild(node);
      });

      if (assets) {
        loadAssets(assets, head, documentInstance);
      }
    },
    [loadAssets]
  );

  const getAssetsAsString = (assets?: Record<string, Asset>) => {
    if (!assets) {
      return '';
    }

    const assetsCache: string[] = [];
    Object.values(assets).forEach(asset => {
      // Asset is already sanitized by sanitizeAssets(); type is in {link, script}
      // and params keys are in the per-type allowlist with URL values validated.
      // Still escape attribute values to be defense-in-depth against any future bypass.
      const attrs = Object.keys(asset.params)
        .map(param => `${param}="${escapeHtml(asset.params[param])}"`)
        .join(' ');
      assetsCache.push(`<${asset.type} ${attrs}>`);
    });

    return assetsCache.join('');
  };

  const [initialHead] = useState(() => getAssetsAsString(safeAssets));

  const contentDidMount = useCallback(() => contentDidMountProp?.(), [contentDidMountProp]);

  useEffect(() => {
    if (iframeLoaded && myDocument) {
      loadBuilderAssets(myDocument, safeAssets);
    }
  }, [iframeLoaded, safeAssets, myDocument, loadBuilderAssets]);

  const handleLoad = useCallback(() => {
    if (iframeLoaded) {
      return;
    }

    onLoad?.(iframeRef.current);
    setIframeLoaded(true);
    setMyDocument(iframeRef.current?.contentDocument);
  }, [iframeLoaded, onLoad]);

  useEffect(() => {
    if (myDocument) {
      // eslint-disable-next-line react-hooks/immutability
      myDocument.body.style.zoom = zoom === 1 ? '' : `${zoom}`;
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
            {!ssrMode && safeCss && (
              <style id="customStyle" asset-static="true">
                {safeCss}
              </style>
            )}
            {ssrMode && safeCss && (
              <style id="customStyle" asset-static="true" dangerouslySetInnerHTML={{ __html: safeCss }} />
            )}
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
