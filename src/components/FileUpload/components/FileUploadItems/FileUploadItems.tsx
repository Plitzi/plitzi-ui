import { useMemo } from 'react';

import useTheme from '@hooks/useTheme';

import FileUploadItem from '../FileUploadItem';

import type FileUploadStyles from '../../FileUpload.styles';
import type { variantKeys } from '../../FileUpload.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type FileUploadItemsProps = {
  value?: File | File[];
  clearable?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onRemove?: (index: number) => () => void;
} & Omit<useThemeSharedProps<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const FileUploadItems = ({
  className,
  clearable,
  intent,
  size,
  error,
  disabled,
  canDragAndDrop,
  value,
  onRemove
}: FileUploadItemsProps) => {
  const classNameTheme = useTheme<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>('FileUpload', {
    className,
    componentKey: ['items'],
    variants: { intent, size, error: !!error, disabled, canDragAndDrop }
  });

  const valueParsed = useMemo(() => (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean), [value]);

  return (
    <div className={classNameTheme.items}>
      {Array.isArray(valueParsed) &&
        valueParsed.map((file, i) => (
          <FileUploadItem
            key={i}
            value={file}
            clearable={clearable}
            intent={intent}
            size={size}
            disabled={disabled}
            error={error}
            canDragAndDrop={canDragAndDrop}
            onRemove={onRemove?.(i)}
          />
        ))}
    </div>
  );
};

export default FileUploadItems;
