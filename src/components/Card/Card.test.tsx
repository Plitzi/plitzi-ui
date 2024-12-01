// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Card from './Card';

describe('Dummy Tests', () => {
  it('Render Component', () => {
    const { baseElement } = render(<Card />);

    expect(baseElement).toBeTruthy();
  });
});