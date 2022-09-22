// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Heading = props => {
  const { type: TagType, className, children } = props;
  if (!TagType) {
    return null;
  }

  return (
    <TagType
      className={classNames(className, {
        'text-6xl font-extrabold': TagType === 'h1',
        'text-5xl font-extrabold': TagType === 'h2',
        'text-3xl font-bold': TagType === 'h3',
        'text-2xl font-bold': TagType === 'h4',
        'text-xl font-bold': TagType === 'h5'
      })}
    >
      {children}
    </TagType>
  );
};

Heading.defaultProps = {
  type: 'h1',
  className: '',
  children: 'Heading'
};

Heading.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
  className: PropTypes.string,
  children: PropTypes.node
};

export default Heading;
