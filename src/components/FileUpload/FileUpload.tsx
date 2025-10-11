import classNames from 'classnames';
import { useCallback, useEffect, useImperativeHandle, useRef, memo } from 'react';

import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import DrawTypes from './components/DrawTypes';
import FileUploadItems from './components/FileUploadItems';
import FileUploadMessage from './components/FileUploadMessage';
import { acceptedExtensions, checkType, getExtension, getFileSizeMB } from './helpers/utils';
import useDragging from './hooks/useDragging';

import type FileUploadStyles from './FileUpload.styles';
import type { variantKeys } from './FileUpload.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactNode, RefObject } from 'react';

const typesDefault = ['jpeg', 'jpg', 'png'];

export type FileUploadProps = {
  ref?: RefObject<HTMLInputElement | null>;
  id?: string;
  name?: string;
  minSize?: number;
  maxSize?: number;
  types?: string[];
  label?: ReactNode;
  loading?: boolean;
  showPreview?: boolean;
  clearable?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  onError?: (error?: string) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
} & (
  | { multiple: true; value?: File[]; onChange?: (files?: File[]) => void; onDrop?: (files: File[]) => void }
  | { multiple?: false; value?: File; onChange?: (files?: File) => void; onDrop?: (files: File) => void }
) &
  Omit<useThemeSharedProps<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const FileUpload = (props: FileUploadProps) => {
  const {
    ref,
    className = '',
    canDragAndDrop = false,
    id,
    clearable = true,
    loading = false,
    name = '',
    value,
    minSize = 0,
    maxSize = Infinity,
    multiple = false,
    disabled = false,
    showPreview = true,
    types = typesDefault,
    label,
    intent,
    size,
    error,
    onError,
    onChange,
    onDraggingStateChange,
    onDrop
  } = props;
  const classNameTheme = useTheme<typeof FileUploadStyles & typeof InputStyles, typeof variantKeys>('FileUpload', {
    className,
    componentKey: [
      'root',
      'inputContainer',
      'iconFloatingContainer',
      'icon',
      'iconError',
      'iconClear',
      'input',
      'subLabel'
    ],
    variants: { intent, size, error: !!error, disabled, canDragAndDrop }
  });
  const labelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => inputRef.current!, []);
  const hasFiles = multiple ? Array.isArray(value) && value.length > 0 : !!value;

  const validate = useCallback(
    (file: File) => {
      if (types.length > 0 && !checkType(file, types)) {
        onError?.(`File type ${getExtension(file)} not allowed`);

        return false;
      }

      if (maxSize && getFileSizeMB(file.size) > maxSize) {
        onError?.('File size is too big');

        return false;
      }

      if (minSize && getFileSizeMB(file.size) < minSize) {
        onError?.('File size is too small');

        return false;
      }

      return true;
    },
    [maxSize, minSize, onError, types]
  );

  const handleChange = useCallback(
    (files?: File | File[]) => {
      let checkError = false;
      if (files) {
        if (files instanceof File) {
          checkError = !validate(files);
        } else {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            checkError = !validate(file) || checkError;
          }
        }

        if (checkError) {
          return false;
        }

        if (props.multiple) {
          props.onChange?.(files as File[] | undefined);
        } else {
          props.onChange?.(files as File | undefined);
        }

        onError?.(undefined);

        return true;
      }

      return false;
    },
    [props, onError, validate]
  );

  const handleClickClear = useCallback(() => {
    if (props.multiple && Array.isArray(value) && value.length > 0) {
      props.onChange?.([]);
    } else if (!multiple && value) {
      onChange?.(undefined);
    }
  }, [props, value, multiple, onChange]);

  const handleClickRemove = useCallback(
    (index: number) => () => {
      if (!value) {
        return;
      }

      if (props.multiple && props.value) {
        props.onChange?.(props.value.toSpliced(index, 1));
      } else {
        onChange?.(undefined);
      }
    },
    [onChange, props, value]
  );

  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple,
    onChange: handleChange,
    onDrop: onDrop as (files: File | File[]) => void,
    disabled: !canDragAndDrop
  });

  useEffect(() => {
    onDraggingStateChange?.(dragging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.target.files) {
        return;
      }

      handleChange(Array.from(e.target.files));
    },
    [handleChange]
  );

  if (!canDragAndDrop) {
    return (
      <InputContainer
        ref={labelRef}
        className={classNameTheme}
        id={id}
        label={label}
        loading={loading}
        clearable={clearable}
        value={value}
        disabled={disabled}
        error={error}
        intent={intent}
        size={size}
        onClear={handleClickClear}
      >
        <div className="flex flex-col w-full gap-2">
          <input
            type="file"
            onChange={handleInputChange}
            accept={acceptedExtensions(types)}
            disabled={disabled}
            name={name}
            ref={inputRef}
            multiple={multiple}
            className={classNameTheme.input}
          />
          {hasFiles && showPreview && (
            <FileUploadItems
              value={value}
              intent={intent}
              size={size}
              disabled={disabled}
              error={error}
              canDragAndDrop={canDragAndDrop}
              onRemove={handleClickRemove}
              clearable={clearable && multiple}
            />
          )}
        </div>
      </InputContainer>
    );
  }

  return (
    <div
      ref={labelRef}
      className={classNames(classNameTheme.root, {
        'border-primary-500 bg-primary-100': dragging,
        'border-red-500': error && !dragging
      })}
    >
      <input
        type="file"
        onChange={handleInputChange}
        accept={acceptedExtensions(types)}
        name={name}
        ref={inputRef}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex flex-col grow items-center justify-center overflow-hidden w-full">
        <Icon
          icon="fa-solid fa-file-circle-plus"
          size={!size || size === 'md' ? '3xl' : size === 'sm' ? '2xl' : 'xl'}
          disabled={disabled}
          intent={error && !dragging ? 'danger' : 'primary'}
        />
        <FileUploadMessage
          label={label}
          disabled={disabled}
          hasFiles={hasFiles}
          error={dragging ? undefined : error}
          intent={intent}
          size={size}
          canDragAndDrop={canDragAndDrop}
        />
        {types.length > 0 && (
          <DrawTypes className={classNameTheme.subLabel} types={types} minSize={minSize} maxSize={maxSize} />
        )}
      </div>
      {value && showPreview && (
        <FileUploadItems
          value={value}
          intent={intent}
          size={size}
          disabled={disabled}
          error={error}
          clearable={clearable}
          canDragAndDrop={canDragAndDrop}
          onRemove={handleClickRemove}
        />
      )}
    </div>
  );
};

export default memo(FileUpload);
