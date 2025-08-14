import useTheme from '@hooks/useTheme';

import type FileUploadStyles from '../../FileUpload.styles';
import type { variantKeys } from '../../FileUpload.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type FileUploadMessageProps = {
  className?: string;
  label?: string;
  hasFiles: boolean;
  disabled: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
} & Omit<useThemeSharedProps<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const FileUploadMessage = ({
  className = '',
  label = '',
  hasFiles = false,
  disabled = false,
  error,
  intent,
  size,
  canDragAndDrop
}: FileUploadMessageProps) => {
  const classNameTheme = useTheme<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>('FileUpload', {
    className,
    componentKey: ['label'],
    variants: { intent, size, error: !!error, disabled, canDragAndDrop }
  });

  return (
    <div className={classNameTheme.label}>
      {label && <span>{label}</span>}
      <span>
        <span className="font-bold underline">Click to Upload</span>
        <span> or drop a file here</span>
      </span>
      {hasFiles && <span>Added Successfully!. Add another?</span>}
      {error && <span>{typeof error === 'boolean' ? 'This field is invalid' : error}</span>}
    </div>
  );
};

export default FileUploadMessage;
