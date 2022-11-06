// Packages
import React, { Children, isValidElement, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';

// Relatives
import DropdownContainer from './DropdownContainer';
import DropdownContent from './DropdownContent';

const Dropdown = props => {
  const {
    children,
    className,
    height,
    width,
    showIcon,
    containerTopOffset,
    containerLeftOffset,
    onContainerVisible,
    closeOnClick,
    backgroundDisabled
  } = props;
  const refParent = useRef(null);
  const refContent = useRef(null);
  const [containerVisible, setContainerVisible] = useState(false);
  const [parameters, setParameters] = useState(undefined);
  const { container, content } = useMemo(() => {
    const components = {};
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === DropdownContainer) {
        components.container = child;
      } else if (child.type === DropdownContent) {
        components.content = child;
      }
    });

    return components;
  }, [children]);

  const calculatePosition = useCallback(
    (rectParent, rectContent, w, h) => {
      if (!w) {
        w = rectContent.width;
      }

      if (!h) {
        h = rectContent.height;
      }

      let top = rectParent.top + rectParent.height + containerTopOffset;
      if (top + h > window.innerHeight) {
        top = rectParent.top - h - containerTopOffset;
      }

      let left = rectParent.left + containerLeftOffset;
      if (left + w > window.innerWidth) {
        left = rectParent.left - w + rectParent.width - containerLeftOffset;
      }

      return { top, left };
    },
    [containerLeftOffset, containerTopOffset]
  );

  const handleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!container || (containerVisible && !closeOnClick)) {
      return;
    }

    if (!containerVisible && refParent.current && refContent.current && container) {
      const rectParent = refParent.current.getBoundingClientRect();
      const rectContent = refContent.current.getBoundingClientRect();
      const parameters = calculatePosition(rectParent, rectContent, width, height);
      setParameters(parameters);
    }

    setContainerVisible(!containerVisible);
    onContainerVisible(!containerVisible);
  };

  const handleClickClose = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      setContainerVisible(false);
      onContainerVisible(false);
    },
    [setContainerVisible, onContainerVisible]
  );

  useEffect(() => {
    if (containerVisible) {
      window.addEventListener('click', handleClickClose, false);
    }

    return () => {
      if (containerVisible) {
        window.removeEventListener('click', handleClickClose, false);
      }
    };
  }, [containerVisible, handleClickClose]);

  return (
    <div ref={refParent} onClick={handleClick} className={className}>
      <div className="flex items-center cursor-pointer w-full h-full">
        {content}
        {showIcon && (
          <div className="flex">
            {!containerVisible && <i className="fa-solid fa-chevron-down" />}
            {containerVisible && <i className="fa-solid fa-chevron-up" />}
          </div>
        )}
      </div>
      {containerVisible && backgroundDisabled && (
        <div
          className="top-0 bottom-0 left-0 right-0 bg-black opacity-40 fixed z-10 fixed"
          onClick={handleClickClose}
        />
      )}
      <div
        ref={refContent}
        className={classNames('dropdown-container__root fixed z-50', {
          hidden: !containerVisible,
          flex: containerVisible && parameters
        })}
        style={parameters}
      >
        {container}
      </div>
    </div>
  );
};

Dropdown.Content = DropdownContent;

Dropdown.Container = DropdownContainer;

Dropdown.defaultProps = {
  children: undefined,
  className: '',
  width: undefined,
  height: undefined,
  containerTopOffset: 5,
  containerLeftOffset: 0,
  showIcon: true,
  backgroundDisabled: false,
  onContainerVisible: noop,
  closeOnClick: true
};

Dropdown.propTypes = {
  showIcon: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  containerTopOffset: PropTypes.number,
  containerLeftOffset: PropTypes.number,
  backgroundDisabled: PropTypes.bool,
  onContainerVisible: noop,
  closeOnClick: PropTypes.bool
};

export default Dropdown;
