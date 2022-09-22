// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

const Select = forwardRef((props, ref) => {
  const { className, children, hasError, size, disabled, placeholder, value, onChange } = props;

  return (
    <select
      ref={ref}
      onChange={onChange}
      value={value}
      className={classNames('border border-gray-300 bg-white focus:outline-none', className, {
        'border-red-500': hasError,
        'px-4 py-2.5': size === 'lg',
        'px-4 py-2 text-sm': size === 'md',
        'px-2 py-1 text-xs': size === 'sm'
      })}
      placeholder={placeholder}
      disabled={disabled}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
});

Select.defaultProps = {
  children: undefined,
  placeholder: '',
  value: '',
  onChange: noop,
  className: '',
  size: 'md',
  disabled: false,
  hasError: false
};

Select.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default Select;
