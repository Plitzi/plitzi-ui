import { createContext } from 'react';

import type { ContainerFloatingProps } from './ContainerFloating';
import type { Dispatch, RefObject } from 'react';

export type ContainerFloatingContextValue = {
  triggerRef?: RefObject<HTMLDivElement>;
  container?: Element | DocumentFragment;
  placement?: ContainerFloatingProps['placement'];
  containerTopOffset?: number;
  containerLeftOffset?: number;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
};

const containerFloatingContextDefaultValue = {} as ContainerFloatingContextValue;

const ContainerFloatingContext = createContext<ContainerFloatingContextValue>(containerFloatingContextDefaultValue);

export default ContainerFloatingContext;
