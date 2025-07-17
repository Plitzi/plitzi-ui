const SizeFromDOM = (element?: HTMLElement | null) => {
  if (!element) {
    return undefined;
  }

  const { offsetWidth, offsetHeight } = element;
  const cs = getComputedStyle(element);
  const {
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    borderLeftWidth,
    borderRightWidth,
    borderTopWidth,
    borderBottomWidth
  } = cs;

  const paddingX = parseFloat(paddingLeft) + parseFloat(paddingRight);
  const paddingY = parseFloat(paddingTop) + parseFloat(paddingBottom);

  const borderX = parseFloat(borderLeftWidth) + parseFloat(borderRightWidth);
  const borderY = parseFloat(borderTopWidth) + parseFloat(borderBottomWidth);

  // Element width and height minus padding and border
  const width = offsetWidth - paddingX - borderX;
  const height = offsetHeight - paddingY - borderY;

  return {
    width,
    height,
    paddingX,
    paddingY,
    borderX,
    borderY,
    raw: {
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth
    }
  };
};

export default SizeFromDOM;
