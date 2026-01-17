import tinycolor from 'tinycolor2';

import type { ColorResult } from '@uiw/color-convert';

export const objectToHex = (color: ColorResult) => {
  const { r, g, b, a } = color.rgba;
  const pColor = tinycolor(`rgba(${r}, ${g}, ${b}, ${a})`);

  return `#${a === 1 ? pColor.toHex() : pColor.toHex8()}`;
};

const COLOR_REGEX = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|var\(--[a-zA-Z0-9_-]+\)|--[a-zA-Z0-9_-]+)$/;

export const isValidVariable = (value: string): boolean => COLOR_REGEX.test(value.trim());
