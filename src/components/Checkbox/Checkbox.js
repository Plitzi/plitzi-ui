// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Checkbox = forwardRef((props, ref) => {
  const { className, intent, size, hasError, ...inputProps } = props;

  return (
    <input
      type="checkbox"
      ref={ref}
      className={classNames(
        'cursor-pointer form-tick appearance-none bg-white border border-gray-300 rounded checked:border-transparent focus:ring-0 focus:ring-offset-0 focus:shadow-none',
        className,
        {
          'checked:text-blue-400 checked:bg-blue-400 hover:border-blue-400': intent === 'primary',
          '': intent === 'secondary',
          'border-red-400': hasError,
          'h-3 w-3 mr-2': size === 'sm',
          'h-4 w-4 mr-2': size === 'md',
          'h-6 w-6 mr-3': size === 'lg'
        }
      )}
      {...inputProps}
    />
  );
});

Checkbox.defaultProps = {
  className: '',
  size: 'md',
  intent: 'primary',
  hasError: false
};

Checkbox.propTypes = {
  className: PropTypes.string,
  hasError: PropTypes.bool,
  intent: PropTypes.oneOf(['primary', 'secondary', 'custom']),
  size: PropTypes.oneOf(['lg', 'md', 'sm'])
};

export default Checkbox;
