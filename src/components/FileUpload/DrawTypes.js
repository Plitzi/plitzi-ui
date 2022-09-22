// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Relatives
import { bytesToSize } from './helpers/utils';

const DrawTypes = props => {
  const { className, types, minSize, maxSize } = props;
  if (!types) {
    return null;
  }

  let size = '';
  if (maxSize) {
    size += `Maximum size ${bytesToSize(maxSize)}, `;
  }

  if (minSize) {
    size += `Minimum size ${bytesToSize(minSize)}, `;
  }

  const stringTypes = types.join(', ');
  if (types.length > 1) {
    return (
      <div title={`${size}types: ${stringTypes}`} className={classNames('flex', className)}>
        <span className="uppercase">{types.slice(0, types.length - 1).join(', ')}</span>
        <span className="mx-1">or</span>
        <span className="uppercase">{types[types.length - 1]}</span>
        {maxSize && <span className="ml-1">({bytesToSize(maxSize)})</span>}
      </div>
    );
  }

  return (
    <span title={`${size}types: ${stringTypes}`} className="uppercase">
      {stringTypes}
    </span>
  );
};

DrawTypes.defaultProps = {
  className: '',
  minSize: 0,
  maxSize: Infinity,
  types: ['jpeg', 'jpg', 'png']
};

DrawTypes.propTypes = {
  className: PropTypes.string,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  types: PropTypes.array
};

export default DrawTypes;
