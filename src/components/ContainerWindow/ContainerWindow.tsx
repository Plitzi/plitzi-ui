import { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';

import useContainerRoot from '@components/ContainerRoot/useContainerRoot';

import type { ReactNode, ReactPortal } from 'react';

export type ContainerWindowProps = {
  title?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  children?: ReactNode;
  onClose?: () => void;
};

const ContainerWindow = ({
  title = 'Plitzi Window',
  top = 200,
  left = 200,
  width = 600,
  height = 400,
  children,
  onClose
}: ContainerWindowProps) => {
  const { getHost } = useContainerRoot();
  const containerEl = useMemo(() => {
    const elementDOM = document.createElement('div');
    elementDOM.setAttribute('stype', 'display:flex;flex-direction:column;min-height:100vh;');

    return elementDOM;
  }, []);
  const externalWindow = useRef<Window>(null);

  const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
      if (styleSheet.href) {
        // true for stylesheets loaded from a URL
        const newLinkEl = document.createElement('link');

        newLinkEl.rel = 'stylesheet';
        newLinkEl.href = styleSheet.href;
        targetDoc.head.appendChild(newLinkEl);
      } else {
        // true for inline styles
        const newStyleEl = document.createElement('style');
        Array.from(styleSheet.cssRules).forEach(cssRule => {
          newStyleEl.appendChild(document.createTextNode(cssRule.cssText));
        });

        targetDoc.head.appendChild(newStyleEl);
      }
    });
  };

  useEffect(() => {
    externalWindow.current = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);
    if (externalWindow.current) {
      externalWindow.current.document.body.appendChild(containerEl);
      externalWindow.current.document.title = title;
      copyStyles(getHost() as Document, externalWindow.current.document);
      // update the state in the parent component if the user closes the
      // new window
      if (onClose) {
        externalWindow.current.addEventListener('beforeunload', onClose);
      }
    } else if (onClose) {
      onClose();
    }

    return () => {
      if (externalWindow.current && onClose) {
        externalWindow.current.removeEventListener('beforeunload', onClose);
      }
    };
  }, [getHost, width, height, left, top, containerEl, title, onClose]);

  return (
    ReactDOM as typeof ReactDOM & { createPortal: (children: ReactNode, containerEl: HTMLDivElement) => ReactPortal }
  ).createPortal(children, containerEl);
};

export default ContainerWindow;
