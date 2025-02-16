import classNames from 'classnames';
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useImperativeHandle
} from 'react';

import useTheme from '@hooks/useTheme';

// Relatives
import ContainerFloatingContainer from './ContainerFloatingContainer';
import ContainerFloatingContent from './ContainerFloatingContent';

import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';

export type ContainerFloatingProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  width?: number;
  height?: number;
  autoWidth?: boolean;
  autoHeight?: boolean;
  containerTopOffset?: number;
  containerLeftOffset?: number;
  backgroundDisabled?: boolean;
  closeOnClick?: boolean;
  popupOpened?: boolean;
  onContainerVisible?: (visible: boolean) => void;
  onCloseValidate?: (e: Event) => boolean;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloating = ({
  ref,
  children,
  className = '',
  width,
  height,
  autoWidth = false,
  autoHeight = false,
  containerTopOffset = 5,
  containerLeftOffset = 0,
  backgroundDisabled = false,
  closeOnClick = true,
  popupOpened = false,
  disabled = false,
  intent,
  onContainerVisible,
  onCloseValidate
}: ContainerFloatingProps) => {
  const [containerVisible, setContainerVisible] = useState(popupOpened);
  const [parameters, setParameters] = useState<{ top?: number; left?: number; width?: number; height?: number }>({});
  const classNameTheme = useTheme<typeof ContainerFloatingStyles, typeof variantKeys, false>('ContainerFloating', {
    className,
    componentKey: ['root', 'backgroundContainer', 'content', 'container'],
    variant: { intent, disabled, visible: containerVisible && !!parameters }
  });
  const rectContainer = useRef<HTMLDivElement | null>(null);
  const refContent = useRef<HTMLDivElement | null>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => rectContainer.current, []);

  const calculatePosition = useCallback(
    (rectParent: DOMRect, rectContent: DOMRect, w?: number, h?: number, _autoWidth?: boolean, autoHeight?: boolean) => {
      if (!w) {
        w = rectContent.width;
      }

      if (!h) {
        h = rectContent.height;
      }

      let top = rectParent.top + rectParent.height + containerTopOffset;
      if (top + h > window.innerHeight && rectParent.top - h - containerTopOffset > 0) {
        // if bottom dont have enough space, render top
        top = rectParent.top - h - containerTopOffset;
      } else if (top + h > window.innerHeight) {
        // cant go top due that is too big, but same for bottom so we need to resize it
        h = window.innerHeight - top - containerTopOffset;
      } else if (top + h < window.innerHeight && autoHeight) {
        h = undefined;
      }

      let left = rectParent.left + containerLeftOffset;
      if (left + w > window.innerWidth) {
        left = rectParent.left - w + rectParent.width - containerLeftOffset;
      }

      return { top, left, width: w, height: h };
    },
    [containerLeftOffset, containerTopOffset]
  );

  const processParameters = useCallback(() => {
    if (rectContainer.current && refContent.current) {
      const rectParent = rectContainer.current.getBoundingClientRect();
      const rectContent = refContent.current.getBoundingClientRect();
      const finalWidth = autoWidth ? rectParent.width : width;
      const finalHeight = autoHeight ? rectContent.height : height;
      const parameters = calculatePosition(rectParent, rectContent, finalWidth, finalHeight, autoWidth, autoHeight);
      setParameters(parameters);
    }
  }, [autoHeight, autoWidth, calculatePosition, height, width]);

  const { container, content } = useMemo(() => {
    const components: { container?: ReactNode; content?: ReactNode } = {};
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ContainerFloatingContainer) {
        components.container = child;
      } else if (child.type === ContainerFloatingContent) {
        components.content = child;
      }
    });

    return components;
  }, [children]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!container || (containerVisible && !closeOnClick) || disabled) {
        return;
      }

      if (!containerVisible && rectContainer.current && refContent.current && container) {
        processParameters();
      } else if (containerVisible) {
        setParameters({});
      }

      setContainerVisible(!containerVisible);
      onContainerVisible?.(!containerVisible);
    },
    [container, containerVisible, closeOnClick, disabled, processParameters, onContainerVisible]
  );

  const handleClickClose = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setContainerVisible(false);
      onContainerVisible?.(false);
      setParameters({});
    },
    [setContainerVisible, onContainerVisible, setParameters]
  );

  const handleClickContainer = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled || !onCloseValidate?.(e.nativeEvent) || !closeOnClick) {
        return;
      }

      setContainerVisible(false);
      onContainerVisible?.(false);
      setParameters({});
    },
    [onCloseValidate, closeOnClick, setContainerVisible, onContainerVisible, disabled]
  );

  const handleClickDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerVisible || (e.key !== 'Enter' && e.key !== 'Escape')) {
        return;
      }

      if (disabled || !onCloseValidate?.(e.nativeEvent) || !closeOnClick) {
        return;
      }

      setContainerVisible(false);
      onContainerVisible?.(false);
      setParameters({});
    },
    [containerVisible, onCloseValidate, closeOnClick, disabled, onContainerVisible]
  );

  useEffect(() => {
    if (disabled || !containerVisible) {
      return undefined;
    }

    window.addEventListener('click', handleClickClose, false);

    return () => {
      window.removeEventListener('click', handleClickClose, false);
    };
  }, [containerVisible, disabled, handleClickClose]);

  useEffect(() => {
    if (!containerVisible && popupOpened) {
      processParameters();
      setContainerVisible(true);
    } else {
      setContainerVisible(false);
      setParameters({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupOpened, processParameters]);

  return (
    <div ref={rectContainer} className={classNameTheme.root}>
      <div className={classNameTheme.content} onClick={handleClick}>
        {content}
      </div>
      {containerVisible && backgroundDisabled && (
        <div className={classNameTheme.backgroundContainer} onClick={handleClickClose} />
      )}
      <div
        ref={refContent}
        className={classNames('dropdown-container__root', classNameTheme.container)}
        style={parameters}
        onClick={handleClickContainer}
        onKeyDown={handleClickDown}
      >
        {container}
      </div>
    </div>
  );
};

ContainerFloating.Content = ContainerFloatingContent;

ContainerFloating.Container = ContainerFloatingContainer;

export default ContainerFloating;
