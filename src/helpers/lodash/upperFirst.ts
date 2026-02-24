export function upperFirst(value: string): string {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
