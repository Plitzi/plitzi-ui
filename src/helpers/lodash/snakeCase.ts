export function snakeCase(value: string): string {
  if (!value) {
    return '';
  }

  const str = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/[_\s-]+/g, ' ')
    .trim();

  return str
    .split(/\s+/)
    .map(s => s.toLowerCase())
    .join('_');
}
