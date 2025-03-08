import { render } from '@testing-library/react';
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
});
