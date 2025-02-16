import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
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
});
