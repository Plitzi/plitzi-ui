import {
  Children,
  isValidElement,
  useMemo,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  cloneElement,
  useEffect
} from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import ContainerFloatingContainer from './ContainerFloatingContainer';
import ContainerFloatingContent from './ContainerFloatingContent';
import ContainerFloatingContext from './ContainerFloatingContext';
import ContainerFloatingTrigger from './ContainerFloatingTrigger';

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
  container?: Element | DocumentFragment;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloating = ({
  ref,
  children,
  containerTopOffset = 0,
  containerLeftOffset = 0,
  closeOnClick = true,
  open: openProp,
  disabled = false,
  testId,
  placement,
  container
}: ContainerFloatingProps) => {
  const [open, setOpen] = useState(openProp ?? false);
  const triggerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => triggerRef.current, []);

  const handleClickTrigger = useCallback(
    () => !disabled && openProp === undefined && setOpen(state => !state),
    [disabled, openProp]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!open || !triggerRef.current || openProp !== undefined) {
        return;
      }

      if (
        !triggerRef.current.contains(e.target as Node) &&
        (!(e.target as HTMLElement).closest('.container-floating') || closeOnClick)
      ) {
        setOpen(false);
      }
    },
    [open, closeOnClick, openProp]
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
          { testId, ...childProps, ref: triggerRef as RefObject<HTMLDivElement>, onClick: handleClickTrigger }
        );
      } else if (child.type === ContainerFloatingContent) {
        const childProps = child.props as ContainerFloatingContentProps;
        components.content = cloneElement<ContainerFloatingContentProps>(
          child as ReactElement<ContainerFloatingContentProps>,
          { testId, ...childProps }
        );
      }
    });

    return components;
  }, [children, handleClickTrigger, testId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, open]);

  useDidUpdateEffect(() => {
    setOpen(openProp ?? false);
  }, [openProp]);

  const containerFloatingContextValue = useMemo<ContainerFloatingContextValue>(
    () => ({
      open,
      placement,
      triggerRef: triggerRef as RefObject<HTMLDivElement>,
      container,
      containerTopOffset,
      containerLeftOffset
    }),
    [open, placement, container, containerTopOffset, containerLeftOffset]
  );

  return (
    <>
      {trigger}
      <ContainerFloatingContext value={containerFloatingContextValue}>
        <ContainerFloatingContainer>{content}</ContainerFloatingContainer>
      </ContainerFloatingContext>
    </>
  );
};

ContainerFloating.Trigger = ContainerFloatingTrigger;

ContainerFloating.Content = ContainerFloatingContent;

export default ContainerFloating;
