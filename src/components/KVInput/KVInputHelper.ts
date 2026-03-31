/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Nested path arrays to nested object
export const arrayToNestedObject = (arr: string[][], mergeDuplicates = false): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const entry of arr) {
    let path: string[];

    if (entry.length === 2 && entry[0].includes('.')) {
      path = [...entry[0].split('.'), entry[1]];
    } else {
      path = entry;
    }

    if (path.length < 2) {
      continue;
    }

    let current = result;

    for (let i = 0; i < path.length - 2; i++) {
      const key = path[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    const lastKey = path[path.length - 2];
    const value = path[path.length - 1];

    if (mergeDuplicates) {
      if (current[lastKey] !== undefined) {
        if (Array.isArray(current[lastKey])) {
          current[lastKey].push(value);
        } else {
          current[lastKey] = [current[lastKey], value];
        }
      } else {
        current[lastKey] = value;
      }
    } else {
      current[lastKey] = value;
    }
  }

  return result;
};

export const nestedObjectToArray = (obj: Record<string, any>, prefix?: string[], useDot?: boolean): string[][] => {
  const result: string[][] = [];
  const currentPrefix = prefix ?? [];
  const isDot = useDot ?? prefix !== undefined;

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...nestedObjectToArray(value as object, [...currentPrefix, key], isDot));
    } else {
      const path = [...currentPrefix, key];
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (isDot) {
            result.push([path.join('.'), String(v)]);
          } else {
            result.push([...path, String(v)]);
          }
        });
      } else {
        if (isDot) {
          result.push([path.join('.'), String(value)]);
        } else {
          result.push([...path, String(value)]);
        }
      }
    }
  }

  return result;
};

export const normalizeToFlatKV = (arr: string[][] | (string | string[])[][]): [string, string][] => {
  const result: [string, string][] = [];

  arr.forEach(path => {
    if (path.length < 2) {
      return;
    }

    const key = path.slice(0, -1).join('.');
    const value = path[path.length - 1];

    if (Array.isArray(value)) {
      value.forEach(v => result.push([key, v]));
    } else {
      result.push([key, value]);
    }
  });

  return result;
};
