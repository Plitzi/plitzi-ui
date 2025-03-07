import { createContext } from 'react';

import type { ContainerFloatingProps } from './ContainerFloating';
import type { RefObject } from 'react';

export type ContainerFloatingContextValue = {
  triggerRef?: RefObject<HTMLDivElement>;
  container?: Element | DocumentFragment;
  placement?: ContainerFloatingProps['placement'];
  containerTopOffset?: number;
  containerLeftOffset?: number;
};

const containerFloatingContextDefaultValue = {} as ContainerFloatingContextValue;

const ContainerFloatingContext = createContext<ContainerFloatingContextValue>(containerFloatingContextDefaultValue);

export default ContainerFloatingContext;
