// Relatives
import * as components from './components';
import * as hooks from './hooks';
import * as tailwind from './tailwind';
const icons = import.meta.glob('./components/Icon/svg/*.tsx', { eager: true });

// Styles
import './assets/index.css';

export * from './components';
export * from './hooks';
export * from './tailwind';

export { components, hooks, tailwind, icons };
