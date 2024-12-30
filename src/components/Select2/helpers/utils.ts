// Types
import type { Option, OptionGroup } from '../Select2';

export const isOptionGroup = (option?: Option | OptionGroup): option is OptionGroup => {
  return !!option && 'options' in option;
};
