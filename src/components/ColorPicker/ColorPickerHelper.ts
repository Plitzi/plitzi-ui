import tinycolor from 'tinycolor2';

import type { ColorResult } from '@uiw/react-color';

export const objectToHex = (color: ColorResult) => {
  const { r, g, b, a } = color.rgba;
  const pColor = tinycolor(`rgba(${r}, ${g}, ${b}, ${a})`);

  return `#${a === 1 ? pColor.toHex() : pColor.toHex8()}`;
};
