import type { ReactNode } from 'react';

export const generateUEID = () => {
  let first: number | string = (Math.random() * 46656) | 0;
  let second: number | string = (Math.random() * 46656) | 0;
  first = `000${first.toString(36)}`.slice(-3);
  second = `000${second.toString(36)}`.slice(-3);

  return first + second;
};

/**
 * The id a toast is known by on screen: the one it was given, else its text with its appearance — one message is one
 * toast however many times it is said. A page in a background tab runs no animation, so no toast closes there: what
 * a page said every minute while nobody looked was a column of the same toast when they came back.
 */
export const toastIdOf = (content: ReactNode, appearance: string, given?: string): string | undefined => {
  if (given !== undefined) {
    return given;
  }

  return typeof content === 'string' || typeof content === 'number' ? `${appearance}:${String(content)}` : undefined;
};
