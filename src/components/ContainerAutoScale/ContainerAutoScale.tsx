import clsx from 'clsx';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import SizeFromDOM from './helpers/SizeFromDOM';

import type { ReactNode } from 'react';

export type ContainerAutoScaleProps = {
  children?: ReactNode;
  className?: string;
  desiredHeight?: number;
  desiredWidth?: number;
};

const ContainerAutoScale = ({
  className = '',
  children,
  desiredHeight = 900,
  desiredWidth = 1440
}: ContainerAutoScaleProps) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const outputsize = useCallback(() => {
    const metrics = SizeFromDOM(containerRef.current);
    if (!metrics) {
      return;
    }

    const { width, height } = metrics;
    setHeight(height);
    setWidth(width);
  }, []);

  useLayoutEffect(() => {
    let observer: ResizeObserver | undefined;
    if (containerRef.current) {
      observer = new ResizeObserver(outputsize);
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [outputsize]);

  let scaleX = width / desiredWidth;
  const scaleY = height / desiredHeight;
  if (scaleX > 1) {
    scaleX = 1;
    desiredWidth = width;
  }

  return (
    <div ref={containerRef} className={clsx(className)} style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: '0 0',
          height: `${height}px`,
          width: `${width}px`
        }}
      >
        <div style={{ width: `${desiredWidth}px`, height: `${desiredHeight}px` }}>{children}</div>
      </div>
    </div>
  );
};

export default ContainerAutoScale;
