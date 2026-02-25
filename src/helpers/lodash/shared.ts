export type Path = string | readonly (string | number)[];

const PATH_REGEX = /[^.[\]]+/g;

export function toPath(path: Path): string[] {
  if (!path) {
    return [];
  }

  if (typeof path === 'string') {
    PATH_REGEX.lastIndex = 0; // Reset regex state

    return path.match(PATH_REGEX) ?? [];
  }

  // path is readonly (string | number)[]
  const result = new Array(path.length) as string[];
  for (let i = 0; i < path.length; i++) {
    result[i] = String(path[i]);
  }

  return result;
}
