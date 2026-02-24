export function sneakCase(value: string): string {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return '';
  }

  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}
