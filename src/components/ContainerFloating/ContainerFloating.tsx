import { Children, isValidElement, useMemo, useImperativeHandle, cloneElement } from 'react';

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
import type { ReactElement, ReactNode, RefObject } from 'react';

export type ContainerFloatingProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  containerTopOffset?: number;
  containerLeftOffset?: number;
  closeOnClick?: boolean;
  open?: boolean;
  testId?: string;
  loading?: boolean;
  container?: Element | DocumentFragment;
  onOpenChange?: (open: boolean) => void;
  onCloseValidate?: (e: Event) => boolean;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloating = ({
  ref,
  children,
  containerTopOffset = 0,
  containerLeftOffset = 0,
  closeOnClick = true,
  open: openProp,
  disabled = false,
  loading = false,
  testId,
  placement,
  container,
  onOpenChange,
  onCloseValidate
}: ContainerFloatingProps) => {
  const [open, , handleClickTrigger, triggerRef] = useFloating({
    open: openProp,
    loading,
    disabled,
    closeOnClick,
    openOnClick: openProp === undefined,
    onCloseValidate
  });
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => triggerRef.current, [triggerRef]);

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
          { testId: testId ? `${testId}-content` : undefined, ...childProps }
        );
      }
    });

    return components;
  }, [children, handleClickTrigger, testId, triggerRef]);

  const containerFloatingContextValue = useMemo<ContainerFloatingContextValue>(
    () => ({
      placement,
      triggerRef: triggerRef as RefObject<HTMLDivElement>,
      container,
      containerTopOffset,
      containerLeftOffset
    }),
    [placement, triggerRef, container, containerTopOffset, containerLeftOffset]
  );

  return (
    <>
      {trigger}
      <ContainerFloatingContext value={containerFloatingContextValue}>
        <ContainerFloatingContainer open={open} onOpenChange={onOpenChange}>
          {content}
        </ContainerFloatingContainer>
      </ContainerFloatingContext>
    </>
  );
};

ContainerFloating.Trigger = ContainerFloatingTrigger;

ContainerFloating.Content = ContainerFloatingContent;

export default ContainerFloating;
