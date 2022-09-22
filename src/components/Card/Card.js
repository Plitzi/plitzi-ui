// Packages
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = forwardRef((props, ref) => {
  const { children, className, style, shadowLevel, allowOverflow, rounded, ...otherProps } = props;

  return (
    <div
      ref={ref}
      {...otherProps}
      className={classNames('bg-white', className, {
        'overflow-hidden': !allowOverflow,
        'rounded-md': rounded,
        'shadow-[0_7px_14px_0_rgba(65,69,88,0.1),0_3px_6px_0_rgba(0,0,0,0.07)]': shadowLevel === 'normal',
        'shadow-[rgba(43,53,86,0.3)_0px_0px_10px_0px]': shadowLevel === 'dark'
      })}
      style={style}
    >
      {children}
    </div>
  );
});

Card.defaultProps = {
  className: '',
  rounded: true,
  allowOverflow: false,
  style: undefined,
  children: undefined,
  shadowLevel: 'normal'
};

Card.propTypes = {
  className: PropTypes.string,
  rounded: PropTypes.bool,
  allowOverflow: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
  shadowLevel: PropTypes.oneOf(['normal', 'dark', 'custom'])
};

export default Card;
