export function camelCase(value: string): string {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return '';
  }

  return value
    .replace(/[-_\s]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, c => c.toLowerCase());
}
