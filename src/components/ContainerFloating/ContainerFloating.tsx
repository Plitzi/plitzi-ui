import { Children, isValidElement, useMemo, cloneElement, useRef, useCallback } from 'react';

import ContainerFloatingContainer from './ContainerFloatingContainer';
import ContainerFloatingContent from './ContainerFloatingContent';
import ContainerFloatingContext from './ContainerFloatingContext';
import ContainerFloatingTrigger from './ContainerFloatingTrigger';
import useFloating from './hooks/useFloating';

import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { ContainerFloatingContentProps } from './ContainerFloatingContent';
import type { ContainerFloatingContextValue } from './ContainerFloatingContext';
import type { ContainerFloatingTriggerProps } from './ContainerFloatingTrigger';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type ContainerFloatingProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  containerTopOffset?: number;
  containerLeftOffset?: number;
  closeOnClick?: boolean;
  open?: boolean;
  testId?: string;
  loading?: boolean;
  container?: Element | DocumentFragment;
  onOpenChange?: (open: boolean) => void;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloating = ({
  ref,
  children,
  containerTopOffset = 0,
  containerLeftOffset = 0,
  open: openProp,
  disabled = false,
  loading = false,
  closeOnClick = true,
  testId,
  placement,
  container,
  onOpenChange
}: ContainerFloatingProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen, handleClickTrigger, triggerRef] = useFloating({
    ref,
    open: openProp,
    loading,
    disabled
  });

  const handleClickContent = useCallback(
    (originalEvent?: (e: MouseEvent<HTMLDivElement>) => void) => (e: MouseEvent<HTMLDivElement>) => {
      originalEvent?.(e);
      if (e.isPropagationStopped()) {
        return;
      }

      if (closeOnClick) {
        setOpen(false);
      }
    },
    [closeOnClick, setOpen]
  );

  const { trigger, content } = useMemo(() => {
    const components: { trigger?: ReactNode; content?: ReactNode } = {};
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === ContainerFloatingTrigger) {
        const childProps = child.props as ContainerFloatingTriggerProps;
        components.trigger = cloneElement<ContainerFloatingTriggerProps>(
          child as ReactElement<ContainerFloatingTriggerProps>,
          {
            testId: testId ? `${testId}-trigger` : undefined,
            onClick: handleClickTrigger,
            ...childProps,
            ref: triggerRef as RefObject<HTMLDivElement>
          }
        );
      } else if (child.type === ContainerFloatingContent) {
        const childProps = child.props as ContainerFloatingContentProps;
        components.content = cloneElement<ContainerFloatingContentProps>(
          child as ReactElement<ContainerFloatingContentProps>,
          {
            testId: testId ? `${testId}-content` : undefined,
            ...childProps,
            onClick: handleClickContent(childProps.onClick)
          }
        );
      }
    });

    return components;
  }, [children, handleClickTrigger, handleClickContent, testId, triggerRef]);

  const containerFloatingContextValue = useMemo<ContainerFloatingContextValue>(
    () => ({
      placement,
      triggerRef: triggerRef as RefObject<HTMLDivElement>,
      container,
      containerTopOffset,
      containerLeftOffset,
      setOpen
    }),
    [placement, triggerRef, container, containerTopOffset, containerLeftOffset, setOpen]
  );

  return (
    <>
      {trigger}
      <ContainerFloatingContext value={containerFloatingContextValue}>
        <ContainerFloatingContainer ref={containerRef} open={open} onOpenChange={onOpenChange}>
          {content}
        </ContainerFloatingContainer>
      </ContainerFloatingContext>
    </>
  );
};

ContainerFloating.Trigger = ContainerFloatingTrigger;

ContainerFloating.Content = ContainerFloatingContent;

export default ContainerFloating;
