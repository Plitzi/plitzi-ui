/**
 * The open overlays — modals and floating panels alike — innermost last: Escape closes only the one on top, so a menu
 * opened inside a modal goes away and leaves the modal open, and a confirmation leaves the panel under it.
 */
const stack: string[] = [];

export const pushOverlay = (id: string): void => {
  stack.push(id);
};

export const removeOverlay = (id: string): void => {
  const index = stack.lastIndexOf(id);
  if (index !== -1) {
    stack.splice(index, 1);
  }
};

export const isTopOverlay = (id: string): boolean => stack[stack.length - 1] === id;
