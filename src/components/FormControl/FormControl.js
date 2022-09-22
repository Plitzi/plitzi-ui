// Packages
import React, { useMemo, useId, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

// Relatives
import Checkbox from '../Checkbox';
import TextArea from '../TextArea';
import Select from '../Select';
import Input from '../Input';
import ColorPicker from '../ColorPicker';

const FormControl = forwardRef((props, ref) => {
  const {
    children,
    name,
    type,
    className,
    inputClassName,
    labelClassName,
    placeholder,
    disabled,
    error,
    size,
    label,
    onChange,
    value,
    inputProps
  } = props;
  const id = useId();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    const { type, message } = error;
    if (type === 'required' && !message) {
      return 'This field is required';
    }

    return message;
  }, [error]);

  return (
    <div className={classNames('flex flex-col', className)}>
      {label && (
        <label
          className={classNames('mb-1 font-medium text-gray-500', labelClassName, {
            'text-base': size === 'lg',
            'text-sm': size === 'md',
            'text-xs': size === 'sm',
            'flex items-center select-none cursor-pointer': type === 'checkbox'
          })}
          htmlFor={id}
        >
          {type === 'checkbox' && (
            <Checkbox
              {...inputProps}
              ref={ref}
              id={id}
              name={name}
              onChange={onChange}
              value={value}
              size={size}
              className={inputClassName}
              hasError={!!errorMessage}
              disabled={disabled}
            />
          )}
          {label}
        </label>
      )}
      {type && ['text', 'number', 'email', 'password'].includes(type) && (
        <Input
          {...inputProps}
          ref={ref}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          type={type}
          size={size}
          className={className}
          inputClassName={inputClassName}
          placeholder={placeholder}
          hasError={!!errorMessage}
          disabled={disabled}
        />
      )}
      {type === 'select' && (
        <Select
          {...inputProps}
          ref={ref}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          size={size}
          className={inputClassName}
          placeholder={placeholder}
          hasError={!!errorMessage}
          disabled={disabled}
        >
          {children}
        </Select>
      )}
      {type === 'textarea' && (
        <TextArea
          {...inputProps}
          ref={ref}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          size={size}
          className={inputClassName}
          placeholder={placeholder}
          hasError={!!errorMessage}
          disabled={disabled}
        />
      )}
      {type === 'color' && (
        <ColorPicker
          {...inputProps}
          ref={ref}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          size={size}
          className={inputClassName}
          placeholder={placeholder}
          hasError={!!errorMessage}
          disabled={disabled}
        />
      )}
      {errorMessage && <div className="text-red-500 mt-1 text-sm">{errorMessage}</div>}
    </div>
  );
});

FormControl.defaultProps = {
  children: undefined,
  className: undefined,
  inputClassName: undefined,
  labelClassName: undefined,
  name: '',
  label: undefined,
  placeholder: '',
  onChange: noop,
  value: undefined,
  type: 'text',
  size: 'md',
  disabled: false,
  error: undefined,
  inputProps: {}
};

FormControl.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  children: PropTypes.node,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  label: PropTypes.node,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.object,
  type: PropTypes.oneOf(['text', 'number', 'email', 'password', 'select', 'checkbox', 'textarea', 'color']),
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])
};

export default FormControl;
