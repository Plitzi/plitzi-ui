// Packages
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import SketchPicker from 'react-color/lib/Sketch';
import tinycolor from 'tinycolor2';

// Relatives
import Dropdown from '../Dropdown';

const ColorPicker = forwardRef((props, ref) => {
  const { id, readOnly, required, className, inputClassName, width, showAlpha, value, size, onChange, ...inputProps } =
    props;
  const [color, setColor] = useState(value);
  const parsedColor = useMemo(() => tinycolor(color), [color]);
  const alpha = useMemo(() => `${Math.round(parsedColor.getAlpha() * 100, 2)}%`, [parsedColor]);
  const isValid = useMemo(() => parsedColor.isValid(), [parsedColor]);
  const pureColor = useMemo(() => (isValid ? `#${parsedColor.toHex()}` : ''), [parsedColor, isValid]);

  useEffect(() => {
    const pColor = tinycolor(value);
    if (pColor.isValid()) {
      setColor(value);
    } else {
      setColor(ColorPicker.defaultProps.value);
    }
  }, [value]);

  const objectToHex = color => {
    const { r, g, b, a } = color.rgb;
    const pColor = tinycolor(`rgba(${r}, ${g}, ${b}, ${a})`);

    return `#${a === 1 ? pColor.toHex() : pColor.toHex8()}`;
  };

  const handlePickerChange = useCallback(newColor => setColor(objectToHex(newColor)), []);

  const handlePickerChangeComplete = useCallback(
    newColor => {
      const hexNewColor = objectToHex(newColor);
      onChange(hexNewColor);
      setColor(hexNewColor);
    },
    [onChange]
  );

  const handleChange = e => {
    // onChange(e.target.value);
    setColor(e.target.value);
  };

  const handleBlur = () => {
    if (isValid) {
      onChange(color);
    } else {
      onChange(ColorPicker.defaultProps.value);
      setColor(ColorPicker.defaultProps.value);
    }
  };

  return (
    <div
      className={classNames('flex relative border', className, {
        'border-gray-300': isValid,
        'border-red-400': !isValid
      })}
    >
      <Dropdown showIcon={false} className="flex items-center justify-center" backgroundDisabled closeOnClick={false}>
        <Dropdown.Content
          className={classNames('flex items-center justify-center border-r h-full', {
            'border-gray-300': isValid,
            'border-red-400': !isValid,
            'p-2.5': size === 'lg',
            'p-2 text-sm': size === 'md',
            'p-1 text-xs': size === 'sm',
            'p-1': size === 'custom'
          })}
        >
          <div className="h-4 w-4 flex cursor-pointer rounded overflow-hidden bg-[url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')]">
            <div className="h-full grow basis-0" style={{ backgroundColor: pureColor }} />
            <div className="h-full grow basis-0" style={{ backgroundColor: isValid ? color : '' }} />
          </div>
        </Dropdown.Content>
        <Dropdown.Container className="">
          <SketchPicker
            color={color}
            onChange={handlePickerChange}
            onChangeComplete={handlePickerChangeComplete}
            width={width}
          />
        </Dropdown.Container>
      </Dropdown>
      <input
        {...inputProps}
        ref={ref}
        id={id}
        readOnly={readOnly}
        required={required}
        className={classNames(
          'focus:ring-transparent border-none grow basis-0 min-w-0',
          {
            'py-2.5': size === 'lg',
            'py-2 text-sm': size === 'md',
            'p-1 text-xs': size === 'sm'
          },
          inputClassName
        )}
        type="text"
        value={color}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {!isValid && (
        <div className="flex items-center justify-center mr-2">
          <i className="fa-solid fa-xmark text-red-400" />
        </div>
      )}
      {showAlpha && (
        <div
          className={classNames('flex items-center justify-center px-1 border-l whitespace-nowrap', {
            'border-gray-300': isValid,
            'border-red-400': !isValid,
            'text-sm': size === 'md',
            'text-xs': size === 'sm'
          })}
        >{`A: ${alpha}`}</div>
      )}
    </div>
  );
});

ColorPicker.defaultProps = {
  className: '',
  inputClassName: '',
  id: '',
  width: 220,
  readOnly: false,
  required: false,
  showAlpha: true,
  value: '#ffffff',
  onChange: noop,
  size: 'md'
};

ColorPicker.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.number,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  showAlpha: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'custom'])
};

export default ColorPicker;
