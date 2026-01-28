type StyleProps = {
  [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[K] extends string ? K : never]?: string;
};

const updateDOMStyles = (el: HTMLElement | null, css: StyleProps) => {
  if (!el) {
    return;
  }

  for (const key in css) {
    el.style[key] = css[key] !== undefined ? css[key] : '';
  }
};

export default updateDOMStyles;
