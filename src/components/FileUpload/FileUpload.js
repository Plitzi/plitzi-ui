// Packages
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

// Relatives
import { acceptedExtensions, checkType, getExtension, getFileSizeMB } from './helpers/utils';
import useDragging from './hooks/useDragging';
import DrawTypes from './DrawTypes';
import FUMessage from './FUMessage';

const FileUpload = props => {
  const {
    className,
    canDragAndDrop,
    name,
    minSize,
    maxSize,
    multiple,
    types,
    disabled,
    label,
    onChange,
    onError,
    onSelect,
    onDraggingStateChange,
    onDrop
  } = props;
  const [currFiles, setFile] = useState([]);
  const [error, setError] = useState(undefined);
  const [uploaded, setUploaded] = useState(false);
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  const validate = file => {
    if (types && !checkType(file, types)) {
      const fileType = getExtension(file);
      setError(`File type ${fileType} not allowed`);
      if (onError) {
        onError(`File type ${fileType} not allowed`);
      }

      return false;
    }

    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError('File size is too big');
      if (onError) {
        onError('File size is too big');
      }

      return false;
    }

    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError('File size is too small');
      if (onError) {
        onError('File size is too small');
      }

      return false;
    }

    return true;
  };

  const handleChange = files => {
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

      if (onChange) {
        onChange(files);
      }

      setFile(files);
      setUploaded(true);
      setError(undefined);

      return true;
    }

    return false;
  };

  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple,
    handleChange,
    onDrop,
    disabled: !canDragAndDrop
  });

  useEffect(() => {
    if (onDraggingStateChange) {
      onDraggingStateChange(dragging);
    }
  }, [dragging]);

  const handleInputChange = ev => {
    const allFiles = ev.target.files;
    const files = multiple ? allFiles : allFiles[0];
    const success = validate(files);
    if (onSelect && success) {
      onSelect(files);
    }
  };

  if (!canDragAndDrop) {
    return (
      <div ref={labelRef} className={classNames('flex', className)}>
        <input type="file" accept={acceptedExtensions(types)} name={name} ref={inputRef} className="w-full" />
      </div>
    );
  }

  return (
    <div
      ref={labelRef}
      htmlFor={name}
      className={classNames(
        'border-2 border-gray-300 border-dashed rounded-md relative cursor-pointer select-none',
        className,
        {
          'border-blue-400 bg-blue-100': dragging,
          'border-red-400': error && !dragging
        }
      )}
    >
      <input
        type="file"
        onChange={handleInputChange}
        accept={acceptedExtensions(types)}
        name={name}
        ref={inputRef}
        className="hidden"
      />
      <div className="flex flex-col grow items-center justify-center overflow-hidden w-full">
        <i className={classNames('fa-solid fa-file-circle-plus fa-2x', { 'text-red-400': error && !dragging })} />
        <FUMessage
          className="mt-2 text-center"
          label={label}
          disabled={disabled}
          hasFiles={currFiles.length > 0}
          uploaded={uploaded}
          error={dragging ? '' : error}
        />
        <DrawTypes
          className="text-xs truncate w-full items-center justify-center"
          types={types}
          minSize={minSize}
          maxSize={maxSize}
        />
      </div>
    </div>
  );
};

FileUpload.defaultProps = {
  children: undefined,
  className: '',
  canDragAndDrop: false,
  name: '',
  minSize: 0,
  maxSize: Infinity,
  multiple: false,
  disabled: false,
  types: ['jpeg', 'jpg', 'png'],
  label: '',
  onError: noop,
  onChange: noop,
  onSelect: noop,
  onDraggingStateChange: noop,
  onDrop: noop
};

FileUpload.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  canDragAndDrop: PropTypes.bool,
  name: PropTypes.string,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  types: PropTypes.array,
  label: PropTypes.string,
  onError: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onDraggingStateChange: PropTypes.func,
  onDrop: PropTypes.func
};

export default FileUpload;
