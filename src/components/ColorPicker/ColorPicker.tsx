import Sketch from '@uiw/react-color-sketch';
import { useCallback, useMemo, useState, memo } from 'react';
import tinycolor from 'tinycolor2';

import { debounce } from '@/helpers/lodash';
import ContainerFloating from '@components/ContainerFloating';
import InputContainer from '@components/Input/InputContainer';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

import { isValidVariable, objectToHex } from './ColorPickerHelper';

import type ColorPickerStyles from './ColorPicker.styles';
import type { variantKeys } from './ColorPicker.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ColorResult } from '@uiw/color-convert';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject } from 'react';

export type ColorPickerProps = {
  ref?: RefObject<HTMLInputElement>;
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  showAlpha?: boolean;
  allowVariables?: boolean;
  required?: boolean;
  value?: string;
  delayOnChange?: number;
  onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof ColorPickerStyles & typeof InputStyles, typeof variantKeys>;

const ColorPicker = ({
  ref,
  className,
  id,
  label = '',
  placeholder = '',
  readOnly = false,
  required = false,
  disabled = false,
  showAlpha = true,
  allowVariables = false,
  value = '#ffffff',
  error,
  size,
  intent,
  delayOnChange = 250,
  onChange,
  ...inputProps
}: ColorPickerProps) => {
  const classNameTheme = useTheme<typeof ColorPickerStyles, typeof variantKeys>('ColorPicker', {
    className,
    componentKey: ['inputColorContainer', 'input', 'divider', 'colorContainer', 'alpha', 'alphaContainer'],
    variants: { intent, size }
  });
  const [color, setColor] = useState(value);
  const parsedColor = useMemo(() => tinycolor(color), [color]);
  const alpha = useMemo(() => `${Math.round(parsedColor.getAlpha() * 100)}%`, [parsedColor]);
  const isValid = useMemo(() => parsedColor.isValid(), [parsedColor]);
  const pureColor = useMemo(() => (isValid ? `#${parsedColor.toHex()}` : ''), [parsedColor, isValid]);

  useDidUpdateEffect(() => {
    setColor(value);
  }, [value]);

  const onChangeDebounced = useMemo(() => {
    if (delayOnChange > 0) {
      return debounce((newColor: ColorResult) => onChange?.(objectToHex(newColor)), delayOnChange);
    }

    return (newColor: ColorResult) => onChange?.(objectToHex(newColor));
  }, [delayOnChange, onChange]);

  const handlePickerChange = useCallback(
    (newColor: ColorResult) => {
      onChangeDebounced(newColor);
      setColor(objectToHex(newColor));
    },
    [onChangeDebounced]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    if (isValid || (allowVariables && isValidVariable(color))) {
      onChange?.(color);
    } else {
      onChange?.('#ffffff');
      setColor('#ffffff');
    }
  }, [allowVariables, color, isValid, onChange]);

  return (
    <InputContainer
      className={className}
      id={id}
      label={label}
      // loading={loading}
      // clearable={clearable}
      value={value}
      disabled={disabled}
      error={error}
      intent={intent}
      size={size}
      // onClear={handleClickClear}
    >
      <div className={classNameTheme.inputColorContainer}>
        <ContainerFloating closeOnClick={false} containerTopOffset={5}>
          <ContainerFloating.Trigger className={classNameTheme.colorContainer}>
            <div className="h-full grow basis-0" style={{ backgroundColor: pureColor }} />
            <div className="h-full grow basis-0" style={{ backgroundColor: isValid ? color : '' }} />
          </ContainerFloating.Trigger>
          <ContainerFloating.Content className="z-802">
            <Sketch color={color} onChange={handlePickerChange} />
          </ContainerFloating.Content>
        </ContainerFloating>
        <div className={classNameTheme.divider} />
        <input
          {...inputProps}
          id={id}
          ref={ref}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          className={classNameTheme.input}
          type="text"
          value={color}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {showAlpha && isValid && (
          <div className={classNameTheme.alphaContainer}>
            <div className={classNameTheme.divider} />
            <div className={classNameTheme.alpha}>{`A: ${alpha}`}</div>
          </div>
        )}
      </div>
    </InputContainer>
  );
};

export default memo(ColorPicker);
