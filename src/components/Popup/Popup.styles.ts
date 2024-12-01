// Alias
import cva from '@/helpers/cvaWrapper';
import ContainerDraggableStyles from '@components/ContainerDraggable/ContainerDraggable.styles';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'Popup';

export default {
  root: cva('pointer-events-auto'),
  btn: ContainerDraggableStyles.btn
};
