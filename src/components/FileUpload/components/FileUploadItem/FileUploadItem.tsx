import { useMemo } from 'react';

import Button from '@components/Button';
import useTheme from '@hooks/useTheme';

import type FileUploadStyles from '../../FileUpload.styles';
import type { variantKeys } from '../../FileUpload.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type FileUploadItemProps = {
  value: File;
  clearable?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onRemove?: () => void;
} & Omit<useThemeSharedProps<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const FileUploadItem = ({
  className,
  clearable,
  intent,
  size,
  error,
  disabled,
  canDragAndDrop,
  value,
  onRemove
}: FileUploadItemProps) => {
  const classNameTheme = useTheme<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>('FileUpload', {
    className,
    componentKey: ['item', 'itemImg', 'itemLabel'],
    variants: { intent, size, error: !!error, disabled, canDragAndDrop }
  });

  const isImage = useMemo(() => value.type.includes('image'), [value]);

  return (
    <div className={classNameTheme.item}>
      {isImage && <img src={URL.createObjectURL(value)} alt={value.name} className={classNameTheme.itemImg} />}
      <div className="flex items-center gap-2">
        {clearable && (
          <Button size="xs" intent="danger" className="border-none remove-file" title="Remove" onClick={onRemove}>
            <Button.Icon icon="fas fa-trash-alt" size="xs" />
          </Button>
        )}
        <span className={classNameTheme.itemLabel} title={value.name}>
          {value.name}
        </span>
      </div>
    </div>
  );
};

export default FileUploadItem;
