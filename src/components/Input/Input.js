// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

const Input = forwardRef((props, ref) => {
  const { className, inputClassName, hasError, size, onChange, value, icon, ...inputProps } = props;

  return (
    <div className={classNames('relative w-full', className)}>
      <input
        {...inputProps}
        ref={ref}
        value={value}
        onChange={onChange}
        className={classNames(
          'w-full bg-white font-rubik outline-none border border-gray-300 placeholder:text-gray-400 hover:border-primary-300 focus:border-primary-300 focus:ring-0',
          inputClassName,
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

Input.defaultProps = {
  className: '',
  inputClassName: '',
  value: '',
  type: 'text',
  size: 'md',
  onChange: noop,
  hasError: false,
  icon: undefined
};

Input.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.node,
  onChange: PropTypes.func,
  hasError: PropTypes.bool,
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'custom'])
};

export default Input;
