import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Input from './Input';

describe('Input Tests', () => {
  it('Render Component', () => {
    render(<Input placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });

  it('labels its input', () => {
    render(<Input label="Corner radius" />);

    expect(screen.getByLabelText('Corner radius')).toBe(screen.getByRole('textbox'));
  });

  it('keeps the id it is given', () => {
    render(<Input id="corner-radius" label="Corner radius" />);

    expect(screen.getByLabelText('Corner radius')).toHaveAttribute('id', 'corner-radius');
  });

  it('gives each input an id of its own', () => {
    render(
      <>
        <Input label="Width" />
        <Input label="Height" />
      </>
    );

    expect(screen.getByLabelText('Width').id).not.toBe(screen.getByLabelText('Height').id);
  });

  it('describes its input with the error message', () => {
    render(<Input label="Corner radius" error="Must be a number" />);

    const input = screen.getByLabelText('Corner radius');
    expect(input).toHaveAccessibleDescription('Must be a number');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks its input invalid without a description when the error has no message', () => {
    render(<Input label="Corner radius" error />);

    const input = screen.getByLabelText('Corner radius');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets the caller describe the input', () => {
    render(
      <>
        <p id="radius-hint">In pixels</p>
        <Input label="Corner radius" error="Must be a number" aria-describedby="radius-hint" />
      </>
    );

    expect(screen.getByLabelText('Corner radius')).toHaveAccessibleDescription('In pixels');
  });
});
