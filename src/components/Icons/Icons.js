// Packages
import React, { lazy, Suspense, useMemo } from 'react';
import PropTypes from 'prop-types';

const Icons = props => {
  const { width, height, iconType, className } = props;

  const Icon = useMemo(
    () => lazy(() => import(`./svg/${iconType}`).catch(() => ({ default: () => <div>Not found</div> }))),
    [iconType]
  );

  return (
    <Suspense>
      <Icon className={className} width={width} height={height} />
    </Suspense>
  );
};

Icons.defaultProps = {
  className: '',
  iconType: null,
  width: 20,
  height: 20
};

Icons.propTypes = {
  className: PropTypes.string,
  iconType: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Icons;
