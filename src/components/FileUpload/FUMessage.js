// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FUMessage = props => {
  const { className, label, error, disabled, uploaded, hasFiles } = props;

  if (error) {
    return (
      <div className={classNames('text-red-400', className)}>
        <span>{error}</span>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={classNames('', className)}>
        <span>Upload disabled</span>
      </div>
    );
  }

  return (
    <div className={classNames('', className)}>
      {!hasFiles && !uploaded && label}
      {!hasFiles && !uploaded && !label && (
        <>
          <span className="font-bold underline">Click to Upload</span>
          <span className="text-md"> or drop a file right here</span>
        </>
      )}
      {hasFiles && uploaded && (
        <>
          <span>Uploaded Successfully!.</span> Upload another?
        </>
      )}
    </div>
  );
};

FUMessage.defaultProps = {
  className: '',
  label: '',
  hasFiles: false,
  disabled: false,
  uploaded: false,
  error: undefined
};

FUMessage.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  hasFiles: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  uploaded: PropTypes.bool
};

export default FUMessage;
