import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Select from './Select';

describe('Select Tests', () => {
  it('Render Component', () => {
    const { baseElement } = render(
      <Select>
        <option value="hello">Hello</option>
      </Select>
    );

    expect(baseElement).toBeTruthy();
  });

  it('labels its select', () => {
    render(
      <Select label="Unit">
        <option value="px">px</option>
      </Select>
    );

    expect(screen.getByLabelText('Unit')).toBe(screen.getByRole('combobox'));
  });

  it('keeps the id it is given', () => {
    render(
      <Select id="unit" label="Unit">
        <option value="px">px</option>
      </Select>
    );

    expect(screen.getByLabelText('Unit')).toHaveAttribute('id', 'unit');
  });

  it('describes its select with the error message', () => {
    render(
      <Select label="Unit" error="Pick a unit">
        <option value="px">px</option>
      </Select>
    );

    const select = screen.getByLabelText('Unit');
    expect(select).toHaveAccessibleDescription('Pick a unit');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });
});
