// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TextArea = forwardRef((props, ref) => {
  const { className, hasError, size, icon, ...inputProps } = props;

  return (
    <div className="relative w-full">
      <textarea
        {...inputProps}
        ref={ref}
        className={classNames(
          'w-full bg-white font-rubik outline-none border border-gray-300 placeholder:text-gray-400 hover:border-primary-300 focus:border-primary-300 focus:ring-0',
          className,
          {
            'border-red-500': hasError,
            'px-4 py-2.5': size === 'lg',
            'px-4 py-2 text-sm': size === 'md',
            'px-2 py-1 text-xs': size === 'sm'
          }
        )}
      />
      {icon}
    </div>
  );
});

TextArea.defaultProps = {
  className: '',
  size: 'md',
  hasError: false,
  icon: undefined
};

TextArea.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  hasError: PropTypes.bool,
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'custom'])
};

export default TextArea;
