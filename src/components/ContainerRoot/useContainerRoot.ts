import { use } from 'react';

import ContainerRootContext from './ContainerRootContext';

const useContainerRoot = () => {
  const containerRootContextValue = use(ContainerRootContext);
  if (typeof containerRootContextValue === 'undefined') {
    throw new Error(
      'ContainerRootContext value is undefined. Make sure you use the ContainerRootProvider before using the context.'
    );
  }

  return containerRootContextValue;
};

export default useContainerRoot;
