import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'CodeMirror';

export default {
  root: cva('h-full grow basis-0 overflow-auto')
};
