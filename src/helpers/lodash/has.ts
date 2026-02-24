/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function has(obj: Record<string, any>, path: string | readonly string[]): boolean {
  if (!(obj as typeof obj | undefined)) {
    return false;
  }

  const paths = Array.isArray(path) ? path : (path as string).split('.');
  let current: any = obj;
  for (const key of paths) {
    if (!current || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }

    current = current[key];
  }

  return true;
}
