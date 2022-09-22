// Packages
import React from 'react';
import PropTypes from 'prop-types';

// Relatives
import Card from '../Card';

const DropdownContainer = props => {
  const { children, className } = props;

  return <Card className={className}>{children}</Card>;
};

DropdownContainer.defaultProps = {
  children: undefined,
  className: ''
};

DropdownContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default DropdownContainer;
