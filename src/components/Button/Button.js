/* eslint-disable react/button-has-type */
// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = forwardRef((props, ref) => {
  const { children, className, intent, size, type, loading, disabled, ...buttonProps } = props;

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        'inline-flex justify-center items-center border-0 font-bold outline-none transition-colors transition-150', // disabled:bg-black-200 disabled:text-black-400
        {
          'bg-blue-400 hover:bg-blue-500 text-white': intent === 'primary' && !disabled,
          // '': intent === 'secondary' && !disabled,
          'bg-red-400 hover:bg-red-500 text-white': intent === 'danger' && !disabled,
          'bg-blue-300 text-white cursor-not-allowed': intent === 'primary' &&  disabled,
          // '': intent === 'secondary' &&  disabled,
          'bg-red-300 text-white cursor-not-allowed': intent === 'danger' &&  disabled,
          'py-2 px-5': size === 'lg',
          'py-2 px-4 text-sm': size === 'md',
          'py-1.5 px-3 text-xs': size === 'sm'
        },
        className
      )}
      disabled={disabled}
      {...buttonProps}
    >
      {loading ? <i className="fa-solid fa-sync fa-spin text-base" /> : children}
    </button>
  );
});

Button.defaultProps = {
  children: undefined,
  className: '',
  loading: false,
  disabled: false,
  type: 'button',
  size: 'md',
  intent: 'primary'
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  intent: PropTypes.oneOf(['primary', 'secondary', 'danger', 'custom']),
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'custom']),
  type: PropTypes.oneOf(['submit', 'button', 'reset'])
};

export default Button;
