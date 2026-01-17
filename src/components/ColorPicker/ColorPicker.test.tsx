import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ColorPicker from './ColorPicker';
import { isValidVariable } from './ColorPickerHelper';

describe('ColorPicker Tests', () => {
  it('Render Component', () => {
    render(<ColorPicker />);

    const alpha = screen.getByText('A: 100%');
    expect(alpha).toBeDefined();
  });
});

describe('isValidVariable', () => {
  it('accepts valid HEX colors', () => {
    expect(isValidVariable('#fff')).toBe(true);
    expect(isValidVariable('#ffffff')).toBe(true);
    expect(isValidVariable('#ffffffff')).toBe(true);
  });

  it('rejects invalid HEX colors', () => {
    expect(isValidVariable('#ff')).toBe(false);
    expect(isValidVariable('#fffff')).toBe(false);
    expect(isValidVariable('#ggg')).toBe(false);
  });

  it('accepts CSS variables with var()', () => {
    expect(isValidVariable('var(--primary)')).toBe(true);
    expect(isValidVariable('var(--primary-color)')).toBe(true);
  });

  it('accepts direct CSS variables', () => {
    expect(isValidVariable('--primary')).toBe(true);
    expect(isValidVariable('--primary_color')).toBe(true);
  });

  it('rejects invalid CSS variable syntax', () => {
    expect(isValidVariable('var(primary)')).toBe(false);
    expect(isValidVariable('--primary color')).toBe(false);
    expect(isValidVariable('var(--primary')).toBe(false);
  });

  it('rejects non-HEX color formats even if tinycolor supports them', () => {
    expect(isValidVariable('rgb(0,0,0)')).toBe(false);
    expect(isValidVariable('hsl(0, 0%, 0%)')).toBe(false);
    expect(isValidVariable('red')).toBe(false);
  });

  it('trims whitespace correctly', () => {
    expect(isValidVariable('  #fff ')).toBe(true);
    expect(isValidVariable(' var(--color) ')).toBe(true);
  });

  it('rejects empty or random values', () => {
    expect(isValidVariable('')).toBe(false);
    expect(isValidVariable(' ')).toBe(false);
    expect(isValidVariable('test')).toBe(false);
  });

  describe('isValidVariable – mixed invalid formats', () => {
    it('rejects rgb/hsl mixed with CSS variables', () => {
      expect(isValidVariable('rgb(var(--r),0,0)')).toBe(false);
      expect(isValidVariable('rgba(var(--r),0,0,1)')).toBe(false);
      expect(isValidVariable('hsl(var(--h), 50%, 50%)')).toBe(false);
      expect(isValidVariable('hsla(var(--h), 50%, 50%, 1)')).toBe(false);
    });

    it('rejects HEX mixed with CSS variables', () => {
      expect(isValidVariable('#ffvar(--a)')).toBe(false);
      expect(isValidVariable('#ff--color')).toBe(false);
    });

    it('rejects nested or malformed var()', () => {
      expect(isValidVariable('var(var(--color))')).toBe(false);
      expect(isValidVariable('var(--color, #fff)')).toBe(false);
    });
  });
});
