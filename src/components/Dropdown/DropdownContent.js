// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DropdownContent = props => {
  const { children, className } = props;

  return <div className={classNames(className)}>{children}</div>;
};

DropdownContent.defaultProps = {
  children: undefined,
  className: 'flex w-full h-full items-center justify-center'
};

DropdownContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default DropdownContent;
