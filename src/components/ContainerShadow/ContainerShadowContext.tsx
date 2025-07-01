import { createContext } from 'react';

export type ContainerShadowContextValue = {
  shadowRoot: ShadowRoot | null;
};

const containerShadowContextDefaultValue: ContainerShadowContextValue = {
  shadowRoot: null
};

const ContainerShadowContext = createContext<ContainerShadowContextValue>(containerShadowContextDefaultValue);

export default ContainerShadowContext;
