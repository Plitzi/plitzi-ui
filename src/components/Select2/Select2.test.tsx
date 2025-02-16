import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Select2 from './Select2';

describe('Select2 Tests', () => {
  it('Render Component', () => {
    const { baseElement } = render(<Select2 options={[{ value: 'hello', label: 'Hello' }]} />);

    expect(baseElement).toBeTruthy();
  });
});
