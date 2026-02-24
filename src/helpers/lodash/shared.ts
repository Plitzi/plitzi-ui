// Types

export type Path = string | readonly (string | number)[];

// Helpers

const PATH_REGEX = /[^.[\]]+/g;

export function toPath(path: Path): string[] {
  if (typeof path === 'string') {
    return path.match(PATH_REGEX) ?? [];
  }

  // path is readonly (string | number)[]
  const result = new Array(path.length) as string[];
  for (let i = 0; i < path.length; i++) {
    result[i] = String(path[i]);
  }

  return result;
}
