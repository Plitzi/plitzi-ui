/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useMemo, useState, memo } from 'react';
// @ts-ignore
import SketchPicker from 'react-color/lib/Sketch.js';
import tinycolor from 'tinycolor2';

import ContainerFloating from '@components/ContainerFloating';
import InputContainer from '@components/Input/InputContainer';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';
import useTheme from '@hooks/useTheme';

import type ColorPickerStyles from './ColorPicker.styles';
import type { variantKeys } from './ColorPicker.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject } from 'react';

export type ColorPickerProps = {
  ref?: RefObject<HTMLInputElement>;
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  showAlpha?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange' | 'size'> &
  useThemeSharedProps<typeof ColorPickerStyles & typeof InputStyles, typeof variantKeys>;

type SketchPickerValue = {
  hex: string;
  hsl: { h: number; s: number; l: number; a: number };
  rgb: { r: number; g: number; b: number; a: number };
  hsv: { h: number; s: number; v: number; a: number };
  oldHue: number;
  source: 'hsv';
};

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
  value = '#ffffff',
  error,
  size,
  intent,
  onChange,
  ...inputProps
}: ColorPickerProps) => {
  const classNameTheme = useTheme<typeof ColorPickerStyles, typeof variantKeys>('ColorPicker', {
    className,
    componentKey: ['inputColorContainer', 'input', 'divider', 'colorContainer', 'alpha'],
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

  const objectToHex = useCallback((color: SketchPickerValue) => {
    const { r, g, b, a } = color.rgb;
    const pColor = tinycolor(`rgba(${r}, ${g}, ${b}, ${a})`);

    return `#${a === 1 ? pColor.toHex() : pColor.toHex8()}`;
  }, []);

  const handlePickerChange = useCallback(
    (newColor: SketchPickerValue) => setColor(objectToHex(newColor)),
    [objectToHex]
  );

  const handlePickerChangeComplete = useCallback(
    (newColor: SketchPickerValue) => {
      const hexNewColor = objectToHex(newColor);
      onChange?.(hexNewColor);
      setColor(hexNewColor);
    },
    [objectToHex, onChange]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // onChange(e.target.value);
    setColor(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    if (isValid) {
      onChange?.(color);
    } else {
      onChange?.('#ffffff');
      setColor('#ffffff');
    }
  }, [color, isValid, onChange]);

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
          <ContainerFloating.Content className="z-[802]">
            <SketchPicker color={color} onChange={handlePickerChange} onChangeComplete={handlePickerChangeComplete} />
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
        {showAlpha && (
          <>
            <div className={classNameTheme.divider} />
            <div className={classNameTheme.alpha}>{`A: ${alpha}`}</div>
          </>
        )}
      </div>
    </InputContainer>
  );
};

export default memo(ColorPicker);
